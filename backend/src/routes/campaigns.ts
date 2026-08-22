import express from 'express';
import { generateCampaign } from '../controllers/campaignController';

const router = express.Router();

router.post('/generate', generateCampaign);

export default router;
