import express from 'express';
import multer from 'multer';
import { getStatus, connectRazorpay, connectDemo, uploadCsv, setupStore } from '../controllers/onboardingController';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/status', getStatus);
router.post('/setup', setupStore);
router.post('/razorpay', connectRazorpay);
router.post('/demo', connectDemo);
router.post('/csv', upload.single('file'), uploadCsv);

export default router;
