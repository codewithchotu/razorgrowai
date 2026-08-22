import { Request, Response } from 'express';
import User from '../models/User';
import AiAction from '../models/AiAction';
import { analyzeGrowthOpportunities } from '../agents/orchestrator';

export const analyzeGrowth = async (req: Request, res: Response) => {
  try {
    const merchant = (req as any).user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    const result = await analyzeGrowthOpportunities(merchant._id as string);
    res.json(result);
  } catch (error) {
    console.error('Error running AI analysis:', error);
    res.status(500).json({ error: 'Failed to run AI analysis' });
  }
};

export const getPendingActions = async (req: Request, res: Response) => {
  try {
    const merchant = (req as any).user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    const actions = await AiAction.find({ merchantId: merchant._id, status: 'Pending Approval' }).sort({ createdAt: -1 });
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI actions' });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const merchant = (req as any).user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    // Exclude Drafts or fetch all, sorted by most recent
    const actions = await AiAction.find({ merchantId: merchant._id }).sort({ updatedAt: -1 });
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

export const approveAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const action = await AiAction.findById(id);
    
    if (!action) return res.status(404).json({ error: 'Action not found' });

    action.status = 'Approved';
    action.executionResult = 'Recovery email and payment link sent successfully (Simulated)';
    action.actualRevenueRecovered = action.expectedRevenueImpact;
    await action.save();

    res.json(action);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve action' });
  }
};

export const rejectAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const action = await AiAction.findById(id);
    
    if (!action) return res.status(404).json({ error: 'Action not found' });

    action.status = 'Rejected';
    await action.save();

    res.json(action);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject action' });
  }
};
