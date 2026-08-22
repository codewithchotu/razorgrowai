import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  merchantId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  totalSpent: number;
  purchaseCount: number;
  lastPurchaseDate?: Date;
  segment: 'High Value' | 'New' | 'Returning' | 'At Risk' | 'Inactive' | 'High Intent';
  createdAt: Date;
}

const CustomerSchema: Schema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  totalSpent: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },
  lastPurchaseDate: { type: Date },
  segment: { 
    type: String, 
    enum: ['High Value', 'New', 'Returning', 'At Risk', 'Inactive', 'High Intent'],
    default: 'New'
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
