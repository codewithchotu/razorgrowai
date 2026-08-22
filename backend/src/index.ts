import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';
import customerRoutes from './routes/customers';
import productRoutes from './routes/products';
import campaignRoutes from './routes/campaigns';
import onboardingRoutes from './routes/onboarding';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/authMiddleware';

dotenv.config({ path: '../.env' }); // Assuming .env is in the root directory

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RazorGrow AI Backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/campaigns', authMiddleware, campaignRoutes);
app.use('/api/onboarding', authMiddleware, onboardingRoutes);

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/razorgrow-demo';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    // Still start server for demo purposes even if DB fails, to allow seeing errors gracefully
    app.listen(port, () => {
      console.log(`Server running on port ${port} (DB Connection Failed)`);
    });
  });
