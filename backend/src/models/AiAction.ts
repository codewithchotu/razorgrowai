import mongoose, { Schema, Document } from 'mongoose';

export interface IAiAction extends Document {
  merchantId: mongoose.Types.ObjectId;
  agent: 'Revenue Agent' | 'Recovery Agent' | 'Growth Agent' | 'Campaign Agent';
  actionType: 'PAYMENT_RECOVERY' | 'CUSTOMER_RETENTION' | 'UPSELL' | 'CROSS_SELL' | 'CAMPAIGN' | 'PAYMENT_RETRY';
  targetType: 'Customer' | 'Segment' | 'Transaction' | 'Product';
  targetId?: mongoose.Types.ObjectId | string;
  decision: string; // The title/opportunity
  reason: string;
  recommendedAction: string;
  expectedRevenueImpact?: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence?: number;
  priorityScore?: number;
  
  // Campaign specific
  targetAudience?: string;
  targetCount?: number;
  discountCost?: number;
  generatedMessage?: string;

  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Running' | 'Completed' | 'Rejected' | 'Executed';
  executionResult?: string;
  actualRevenueRecovered?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AiActionSchema: Schema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: String, enum: ['Revenue Agent', 'Recovery Agent', 'Growth Agent', 'Campaign Agent'], required: true },
  actionType: { type: String, enum: ['PAYMENT_RECOVERY', 'CUSTOMER_RETENTION', 'UPSELL', 'CROSS_SELL', 'CAMPAIGN', 'PAYMENT_RETRY'], default: 'PAYMENT_RECOVERY' },
  targetType: { type: String, enum: ['Customer', 'Segment', 'Transaction', 'Product'], required: true },
  targetId: { type: Schema.Types.Mixed },
  decision: { type: String, required: true },
  reason: { type: String, required: true },
  recommendedAction: { type: String, required: true },
  expectedRevenueImpact: { type: Number },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  confidence: { type: Number },
  priorityScore: { type: Number },

  // Campaign specific
  targetAudience: { type: String },
  targetCount: { type: Number },
  discountCost: { type: Number },
  generatedMessage: { type: String },

  status: { 
    type: String, 
    enum: ['Draft', 'Pending Approval', 'Approved', 'Running', 'Completed', 'Rejected', 'Executed'], 
    default: 'Pending Approval' 
  },
  executionResult: { type: String },
  actualRevenueRecovered: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IAiAction>('AiAction', AiActionSchema);
