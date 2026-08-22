import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Customer from '../models/Customer';
import User from '../models/User';

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    // For demo purposes, fetch the first user
    const merchant = (req as any).user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    const merchantId = merchant._id;

    // Aggregations
    const [
      revenueResult,
      transactionCounts,
      customerCount
    ] = await Promise.all([
      Transaction.aggregate([
        { $match: { merchantId, status: 'successful' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { merchantId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Customer.countDocuments({ merchantId })
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    
    let successfulCount = 0;
    let failedCount = 0;
    let abandonedCount = 0;

    transactionCounts.forEach(t => {
      if (t._id === 'successful') successfulCount = t.count;
      if (t._id === 'failed') failedCount = t.count;
      if (t._id === 'abandoned') abandonedCount = t.count;
    });

    const totalTransactions = successfulCount + failedCount + abandonedCount;
    const conversionRate = totalTransactions > 0 ? (successfulCount / totalTransactions) * 100 : 0;
    const averageOrderValue = successfulCount > 0 ? totalRevenue / successfulCount : 0;

    // Time-series data for chart (mocking last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueOverTime = await Transaction.aggregate([
      { $match: { merchantId, status: 'successful', createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      metrics: {
        totalRevenue,
        revenueGrowth: 12.5, // Mock growth percentage
        successfulPayments: successfulCount,
        failedPayments: failedCount,
        abandonedCheckouts: abandonedCount,
        recoveredRevenue: 4999, // Mock for now
        conversionRate,
        averageOrderValue,
        totalCustomers: customerCount
      },
      charts: {
        revenueOverTime: revenueOverTime.map(item => ({
          date: item._id,
          revenue: item.revenue
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};

export const getPaymentIntelligence = async (req: Request, res: Response) => {
  try {
    const merchant = (req as any).user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    const merchantId = merchant._id;

    const [
      failureReasons,
      paymentMethods,
      statusCounts
    ] = await Promise.all([
      Transaction.aggregate([
        { $match: { merchantId, status: { $in: ['failed', 'abandoned'] }, failureReason: { $exists: true, $ne: null } } },
        { $group: { _id: '$failureReason', count: { $sum: 1 } } }
      ]),
      Transaction.aggregate([
        { $match: { merchantId, paymentMethod: { $exists: true, $ne: null } } },
        { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
      ]),
      Transaction.aggregate([
        { $match: { merchantId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    let success = 0;
    let failed = 0;
    statusCounts.forEach(s => {
      if (s._id === 'successful') success = s.count;
      if (s._id === 'failed' || s._id === 'abandoned') failed += s.count;
    });

    const successRate = success + failed > 0 ? (success / (success + failed)) * 100 : 0;

    res.json({
      failureReasons: failureReasons.map(r => ({ name: r._id, value: r.count })),
      paymentMethods: paymentMethods.map(p => ({ name: p._id, value: p.count })),
      successRate,
      insights: [
        "UPI payment failures increased by 8% this week.",
        "Most common failure reason is 'Insufficient funds or bank timeout'.",
        "Credit card payments have the highest success rate (94%)."
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment intelligence' });
  }
};
