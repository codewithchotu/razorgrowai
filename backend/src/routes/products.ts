import express from 'express';
import { getProducts, getProductInsights } from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/insights', getProductInsights);

export default router;
