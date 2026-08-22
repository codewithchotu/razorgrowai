import mongoose from 'mongoose';
import User from '../models/User';
import Customer from '../models/Customer';
import Transaction from '../models/Transaction';
import Guardrails from '../models/Guardrails';
import AiAction from '../models/AiAction';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config({ path: '../../.env' });

export const seedDemoDataForMerchant = async (merchantId: string | mongoose.Types.ObjectId) => {
  try {
    console.log(`Seeding Demo Data for Merchant ${merchantId}...`);
    
    // Clear existing data for this merchant
    await Customer.deleteMany({ merchantId });
    await Transaction.deleteMany({ merchantId });
    await Guardrails.deleteMany({ merchantId });
    await AiAction.deleteMany({ merchantId });

    // Seed Guardrails
    await Guardrails.create({
      merchantId,
      autoApproveRecovery: false,
      maxDiscountPercentage: 15,
      maxCampaignBudget: 10000,
      riskTolerance: 'Medium',
      blockHighRiskActions: true
    });

    // Seed Customers
    const customers = [];
    const segments = ['High Value', 'New', 'Returning', 'At Risk', 'Inactive'];
    
    for (let i = 0; i < 50; i++) {
      customers.push({
        merchantId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        totalSpent: faker.number.int({ min: 1000, max: 50000 }),
        purchaseCount: faker.number.int({ min: 1, max: 20 }),
        segment: segments[Math.floor(Math.random() * segments.length)],
        lastPurchaseDate: faker.date.recent({ days: 90 })
      });
    }
    const savedCustomers = await Customer.insertMany(customers);

    // Seed Transactions
    const transactions = [];
    const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];
    const failureReasons = ['Insufficient funds', 'Network error', 'Bank server down', 'Authentication failed'];
    
    const products = [
      { id: 'P1', name: 'Wireless Headphones', price: 2999 },
      { id: 'P2', name: 'Headphone Stand', price: 999 },
      { id: 'P3', name: 'Mechanical Keyboard', price: 4999 },
      { id: 'P4', name: 'Gaming Mouse', price: 1999 },
      { id: 'P5', name: 'Monitor Arm', price: 3499 }
    ];

    for (let i = 0; i < 200; i++) {
      const customer = savedCustomers[Math.floor(Math.random() * savedCustomers.length)];
      // Weighted status to have mostly successes, but decent amount of abandoned/failed
      const rand = Math.random();
      const status = rand < 0.6 ? 'successful' : rand < 0.8 ? 'abandoned' : rand < 0.95 ? 'failed' : 'refunded';
      
      const isFailed = status === 'failed' || status === 'abandoned';
      const reason = isFailed ? failureReasons[Math.floor(Math.random() * failureReasons.length)] : undefined;
      
      // Random product selection (1-3 products)
      const numProducts = faker.number.int({ min: 1, max: 3 });
      const items = [];
      let amount = 0;
      for(let j = 0; j < numProducts; j++) {
        const prod = products[Math.floor(Math.random() * products.length)];
        items.push({
          productId: prod.id,
          name: prod.name,
          quantity: 1,
          price: prod.price
        });
        amount += prod.price;
      }

      transactions.push({
        merchantId,
        customerId: customer._id,
        amount,
        status,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        failureReason: reason,
        items,
        createdAt: faker.date.recent({ days: 30 })
      });
    }
    
    await Transaction.insertMany(transactions);

    console.log(`Seeding completed successfully for Merchant ${merchantId}!`);
    return { success: true };
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

// If run directly (e.g. via npm run seed)
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/razorgrow-demo')
    .then(async () => {
      // Find or create a default user for seeding
      const UserModel = require('../models/User').default;
      let user = await UserModel.findOne();
      if (!user) {
         user = await UserModel.create({
           email: 'demo@razorpay.com',
           name: 'Demo Merchant',
           businessName: 'Demo Store',
           dataSource: 'DEMO_MODE'
         });
      }
      await seedDemoDataForMerchant(user._id);
      process.exit(0);
    }).catch(e => {
      console.error(e);
      process.exit(1);
    });
}
