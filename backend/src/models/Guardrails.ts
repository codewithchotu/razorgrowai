import mongoose, { Schema, Document } from 'mongoose';

export interface IGuardrails extends Document {
  merchantId: mongoose.Types.ObjectId;
  maxDiscountPercentage: number;
  maxDiscountAmount: number;
  maxDailyAiActions: number;
  requireApprovalForDiscounts: boolean;
  requireApprovalForPaymentLinks: boolean;
  maxCampaignBudget: number;
  maxTargetingFrequencyDays: number;
  minOrderValueForOffers: number;
}

const GuardrailsSchema: Schema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  maxDiscountPercentage: { type: Number, default: 10 },
  maxDiscountAmount: { type: Number, default: 500 },
  maxDailyAiActions: { type: Number, default: 100 },
  requireApprovalForDiscounts: { type: Boolean, default: true },
  requireApprovalForPaymentLinks: { type: Boolean, default: true },
  maxCampaignBudget: { type: Number, default: 10000 },
  maxTargetingFrequencyDays: { type: Number, default: 7 }, // Don't target more than once a week
  minOrderValueForOffers: { type: Number, default: 1000 },
}, { timestamps: true });

export default mongoose.model<IGuardrails>('Guardrails', GuardrailsSchema);
