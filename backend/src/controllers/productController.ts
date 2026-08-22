import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import User from '../models/User';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getProducts = async (req: Request, res: Response) => {
  try {
    const merchant = (req as any).user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    // Aggregate product performance
    const transactions = await Transaction.find({ merchantId: merchant._id });
    
    const productStats: Record<string, any> = {};

    transactions.forEach(tx => {
      tx.items.forEach(item => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = {
            id: item.productId,
            name: item.name,
            price: item.price,
            unitsSold: 0,
            revenue: 0,
            totalAttempts: 0,
            successfulAttempts: 0
          };
        }
        
        productStats[item.productId].totalAttempts += item.quantity;
        
        if (tx.status === 'successful') {
          productStats[item.productId].unitsSold += item.quantity;
          productStats[item.productId].revenue += item.price * item.quantity;
          productStats[item.productId].successfulAttempts += item.quantity;
        }
      });
    });

    const products = Object.values(productStats).map(p => ({
      ...p,
      conversion: p.totalAttempts > 0 ? (p.successfulAttempts / p.totalAttempts) * 100 : 0,
      trend: p.revenue > 5000 ? 'Up' : 'Down', // Mock trend
      status: p.revenue > 10000 ? 'Excellent' : 'Needs Attention'
    }));

    products.sort((a, b) => b.revenue - a.revenue);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductInsights = async (req: Request, res: Response) => {
  try {
    const merchant = (req as any).user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    let insights;

    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: 'application/json' } });
        const prompt = `Based on typical electronics purchases, recommend a cross-sell opportunity between a primary item (e.g. Wireless Headphones) and an accessory.
        Return JSON array of 1 object:
        [{
          "sourceProduct": "Product A",
          "recommendedProduct": "Product B",
          "confidence": 85,
          "reason": "Customers often buy these together.",
          "expectedRevenueOpportunity": 5000
        }]`;
        
        const result = await model.generateContent(prompt);
        insights = JSON.parse(result.response.text());
      } catch (e) {
        console.error(e);
      }
    }

    if (!insights) {
      // Mock Fallback
      insights = [{
        sourceProduct: "Wireless Headphones",
        recommendedProduct: "Headphone Stand",
        confidence: 88,
        reason: "Customers who purchase Wireless Headphones frequently purchase a Headphone Stand.",
        expectedRevenueOpportunity: 12500
      }];
    }

    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product insights' });
  }
};
