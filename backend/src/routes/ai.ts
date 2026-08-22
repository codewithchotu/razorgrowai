import express from 'express';
import { analyzeGrowth, getPendingActions, approveAction, rejectAction, getAuditLogs } from '../controllers/aiController';

const router = express.Router();

router.post('/analyze', analyzeGrowth);
router.get('/actions', getPendingActions);
router.get('/audit', getAuditLogs);
router.post('/actions/:id/approve', approveAction);
router.post('/actions/:id/reject', rejectAction);

export default router;
