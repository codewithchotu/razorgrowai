import { Request, Response } from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import User from '../models/User';
import Customer from '../models/Customer';
import Transaction from '../models/Transaction';
import { seedDemoDataForMerchant } from '../utils/seedData';
import mongoose from 'mongoose';

// Setup multer for CSV upload (memory storage)
const upload = multer({ dest: 'uploads/' });

export const getStatus = async (req: any, res: Response) => {
  try {
    const merchant = req.user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });
    
    res.json({
      dataSource: merchant.dataSource,
      lastSyncedAt: merchant.lastSyncedAt,
      transactionCount: merchant.transactionCount,
      onboardingCompleted: merchant.onboardingCompleted
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch onboarding status' });
  }
};

export const setupStore = async (req: any, res: Response) => {
  try {
    const merchant = req.user;
    const { businessName, businessCategory, growthGoal } = req.body;
    
    merchant.businessName = businessName;
    merchant.businessCategory = businessCategory;
    merchant.growthGoal = growthGoal;
    merchant.onboardingCompleted = true;
    
    await merchant.save();
    res.json({ success: true, message: 'Store setup completed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup store' });
  }
};

export const connectRazorpay = async (req: any, res: Response) => {
  try {
    const merchant = req.user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    // Mock syncing from Razorpay (seed data)
    await seedDemoDataForMerchant(merchant._id as mongoose.Types.ObjectId);
    
    const count = await Transaction.countDocuments({ merchantId: merchant._id });
    
    merchant.dataSource = 'RAZORPAY_CONNECTED';
    merchant.lastSyncedAt = new Date();
    merchant.transactionCount = count;
    await merchant.save();

    res.json({ success: true, message: 'Razorpay connected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect Razorpay' });
  }
};

export const connectDemo = async (req: any, res: Response) => {
  try {
    const merchant = req.user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    // Seed data
    await seedDemoDataForMerchant(merchant._id as mongoose.Types.ObjectId);
    
    const count = await Transaction.countDocuments({ merchantId: merchant._id });
    
    merchant.dataSource = 'DEMO_MODE';
    merchant.lastSyncedAt = new Date();
    merchant.transactionCount = count;
    await merchant.save();

    res.json({ success: true, message: 'Demo mode activated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate demo mode' });
  }
};

export const uploadCsv = async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const merchant = req.user;
    if (!merchant) return res.status(404).json({ error: 'Merchant not found' });

    const results: any[] = [];
    
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Clear existing data
        await Customer.deleteMany({ merchantId: merchant._id });
        await Transaction.deleteMany({ merchantId: merchant._id });
        
        const customerMap = new Map();

        // Process CSV
        for (const row of results) {
          if (!customerMap.has(row.customer_id)) {
            customerMap.set(row.customer_id, {
              merchantId: merchant._id,
              name: row.customer_name || 'Unknown Customer',
              email: row.email,
              segment: 'New', // Default
              totalSpent: 0,
              purchaseCount: 0
            });
          }
        }

        const savedCustomers = await Customer.insertMany(Array.from(customerMap.values()));
        const customerDbMap = new Map();
        savedCustomers.forEach(c => customerDbMap.set(c.email, c._id));

        const transactions = results.map(row => {
           const cId = customerDbMap.get(row.email);
           let status = row.status?.toLowerCase().trim() || 'successful';
           if (status === 'success') status = 'successful';
           
           return {
             merchantId: merchant._id,
             customerId: cId,
             amount: Number(row.amount) || 0,
             status: status,
             paymentMethod: row.payment_method || 'CARD',
             items: [{
               productId: row.product_id,
               name: row.product,
               price: Number(row.amount) || 0,
               quantity: 1
             }],
             createdAt: row.transaction_date ? new Date(row.transaction_date) : new Date()
           }
        });

        await Transaction.insertMany(transactions);
        
        // Update merchant stats based on new data
        for (const c of savedCustomers) {
           const txs = await Transaction.find({ customerId: c._id, status: 'successful' });
           c.purchaseCount = txs.length;
           c.totalSpent = txs.reduce((sum, tx) => sum + tx.amount, 0);
           await c.save();
        }
        
        merchant.dataSource = 'CSV_IMPORTED';
        merchant.lastSyncedAt = new Date();
        merchant.transactionCount = transactions.length;
        await merchant.save();

        // Delete temp file
        fs.unlinkSync(req.file!.path);

        res.json({ success: true, message: 'CSV Imported successfully', count: transactions.length });
      });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process CSV' });
  }
};
