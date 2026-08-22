import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  businessName?: string;
  businessCategory?: string;
  growthGoal?: string;
  firebaseUid?: string; // Optional for now
  onboardingCompleted: boolean;
  dataSource: 'NOT_CONNECTED' | 'RAZORPAY_CONNECTED' | 'CSV_IMPORTED' | 'DEMO_MODE';
  lastSyncedAt?: Date;
  transactionCount: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  businessName: { type: String },
  businessCategory: { type: String },
  growthGoal: { type: String },
  firebaseUid: { type: String, unique: true, sparse: true },
  onboardingCompleted: { type: Boolean, default: false },
  dataSource: { 
    type: String, 
    enum: ['NOT_CONNECTED', 'RAZORPAY_CONNECTED', 'CSV_IMPORTED', 'DEMO_MODE'], 
    default: 'NOT_CONNECTED' 
  },
  lastSyncedAt: { type: Date },
  transactionCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
