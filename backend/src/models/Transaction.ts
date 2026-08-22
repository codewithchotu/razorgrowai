import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  merchantId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'successful' | 'failed' | 'abandoned' | 'refunded';
  items: Array<{ productId: string, name: string, price: number, quantity: number }>;
  failureReason?: string;
  paymentMethod?: string;
  razorpayOrderId?: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['successful', 'failed', 'abandoned', 'refunded'], 
    required: true 
  },
  items: [{
    productId: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number }
  }],
  failureReason: { type: String },
  paymentMethod: { type: String },
  razorpayOrderId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
