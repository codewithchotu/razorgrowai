import { Request, Response } from 'express';
import AiAction from '../models/AiAction';
import User from '../models/User';
import Customer from '../models/Customer';
import Guardrails from '../models/Guardrails';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateCampaign = async (req: Request, res: Response) => {
  try {
    const { goal } = req.body;
    const merchant = (req as any).user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    const guardrails = await Guardrails.findOne({ merchantId: merchant._id });
    
    // Quick estimation of target audience
    const customersCount = await Customer.countDocuments({ merchantId: merchant._id, segment: 'High Value' });

    let campaignData;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });
        const prompt = `
          Create a marketing campaign for: "${goal}"
          Merchant Guardrails: Max discount ${guardrails?.maxDiscountPercentage}%, Max budget ₹${guardrails?.maxCampaignBudget}.
          Target audience size: ${customersCount}.
          
          Return JSON:
          {
            "targetAudience": "description of audience",
            "offer": "discount or offer string",
            "generatedMessage": "Hi {{customer}}, ...",
            "expectedRevenue": number,
            "discountCost": number,
            "riskLevel": "Low" | "Medium" | "High"
          }
        `;
        
        const result = await model.generateContent(prompt);
        campaignData = JSON.parse(result.response.text());
      } catch (e) {
        console.error(e);
      }
    }

    if (!campaignData) {
      // Mock Fallback
      campaignData = {
        targetAudience: "High-value customers with abandoned payments",
        offer: `${guardrails?.maxDiscountPercentage || 5}% discount`,
        generatedMessage: "Hi {{customer}}, you left something in your cart. Complete your purchase today and enjoy a discount.",
        expectedRevenue: customersCount * 1500,
        discountCost: customersCount * 150,
        riskLevel: "Medium"
      };
    }

    // Save as Draft initially, or Pending Approval if generated
    const action = await AiAction.create({
      merchantId: merchant._id,
      agent: 'Campaign Agent',
      actionType: 'CAMPAIGN',
      targetType: 'Segment',
      decision: `Campaign: ${goal}`,
      reason: `Targeting ${campaignData.targetAudience}`,
      recommendedAction: `Send campaign offering ${campaignData.offer}`,
      expectedRevenueImpact: campaignData.expectedRevenue,
      riskLevel: campaignData.riskLevel,
      targetAudience: campaignData.targetAudience,
      targetCount: customersCount,
      discountCost: campaignData.discountCost,
      generatedMessage: campaignData.generatedMessage,
      status: 'Pending Approval' // Ready for merchant review in Action Center
    });

    res.json(action);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate campaign' });
  }
};
