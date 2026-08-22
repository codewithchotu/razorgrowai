import express from 'express';
import { getCustomers, getCustomerProfile, getCustomerInsights } from '../controllers/customerController';

const router = express.Router();

router.get('/', getCustomers);
router.get('/:id', getCustomerProfile);
router.get('/:id/insights', getCustomerInsights);

export default router;
