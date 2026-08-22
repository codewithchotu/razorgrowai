import express from 'express';
import { getDashboardMetrics, getPaymentIntelligence } from '../controllers/analyticsController';

const router = express.Router();

router.get('/metrics', getDashboardMetrics);
router.get('/payment-intelligence', getPaymentIntelligence);

export default router;
