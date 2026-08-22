import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/Transaction';
import Customer from '../models/Customer';
import AiAction from '../models/AiAction';
import Guardrails from '../models/Guardrails';
import mongoose from 'mongoose';

const apiKey = process.env.AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const analyzeGrowthOpportunities = async (merchantId: string) => {
  const abandonedTx = await Transaction.find({ merchantId, status: 'abandoned' }).populate('customerId');
  const guardrails = await Guardrails.findOne({ merchantId });
  const customers = await Customer.find({ merchantId });
  
  let aiResponseJSON;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });
      const prompt = `
        You are a Growth Agent analyzing merchant data.
        Abandoned Checkouts: ${abandonedTx.length}
        Total Customers: ${customers.length}
        Guardrails: Max Discount ${guardrails?.maxDiscountPercentage}%
        
        Generate 3 growth opportunities based on this data (Revenue Recovery, Customer Upsell, etc).
        Score each out of 100 based on Revenue, Confidence, Risk, and Urgency.
        
        Return JSON format:
        {
          "opportunities": [
            {
              "type": "PAYMENT_RECOVERY" | "UPSELL" | "CUSTOMER_RETENTION",
              "title": "Short title",
              "reason": "Why?",
              "potentialRevenue": number,
              "confidence": number,
              "risk": "Low" | "Medium" | "High",
              "recommendedAction": "action description",
              "priorityScore": number
            }
          ]
        }
      `;
      const result = await model.generateContent(prompt);
      aiResponseJSON = JSON.parse(result.response.text());
    } catch (e) {
      console.error("AI API Error, falling back to mock:", e);
      aiResponseJSON = getMockAnalysis(abandonedTx, customers);
    }
  } else {
    aiResponseJSON = getMockAnalysis(abandonedTx, customers);
  }

  // Filter and sort opportunities by priority score
  const opportunities = aiResponseJSON.opportunities.sort((a: any, b: any) => b.priorityScore - a.priorityScore);
  
  // Save the top opportunity as a pending action for the Action Center
  const topOpp = opportunities[0];
  const aiAction = await AiAction.create({
    merchantId,
    agent: 'Growth Agent',
    actionType: topOpp.type,
    targetType: topOpp.type === 'PAYMENT_RECOVERY' ? 'Transaction' : 'Customer',
    decision: topOpp.title,
    reason: topOpp.reason,
    recommendedAction: topOpp.recommendedAction,
    expectedRevenueImpact: topOpp.potentialRevenue,
    riskLevel: topOpp.risk,
    confidence: topOpp.confidence,
    priorityScore: topOpp.priorityScore,
    status: 'Pending Approval'
  });

  return {
    analysis: aiResponseJSON,
    actionId: aiAction._id
  };
};

function getMockAnalysis(abandonedTx: any[], customers: any[]) {
  const highValueCount = customers.filter(c => c.segment === 'High Value').length;
  return {
    opportunities: [
      {
        type: "PAYMENT_RECOVERY",
        title: `Recover ${abandonedTx.length} abandoned payments`,
        reason: `${abandonedTx.length} customers abandoned checkouts recently.`,
        potentialRevenue: abandonedTx.length * 1500,
        confidence: 85,
        risk: "Low",
        recommendedAction: "Send personalized payment reminders",
        priorityScore: 92
      },
      {
        type: "CUSTOMER_RETENTION",
        title: `Reactivate ${highValueCount} inactive high-value customers`,
        reason: `These customers haven't purchased in 30 days.`,
        potentialRevenue: highValueCount * 2000,
        confidence: 70,
        risk: "Medium",
        recommendedAction: "Send a 10% retention discount",
        priorityScore: 78
      },
      {
        type: "UPSELL",
        title: "Upsell Product Accessories",
        reason: "Strong cross-sell relationship detected in recent transactions.",
        potentialRevenue: 5400,
        confidence: 90,
        risk: "Low",
        recommendedAction: "Add one-click upsell to checkout",
        priorityScore: 85
      }
    ]
  };
}
