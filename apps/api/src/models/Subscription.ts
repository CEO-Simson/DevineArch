import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  organizationId: Schema.Types.ObjectId;
  type: 'superadmin' | 'additional_admin';
  amount: number; // in INR
  currency: string;
  billingCycle: 'yearly';
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  paymentDetails: {
    method?: 'card' | 'upi' | 'netbanking' | 'wallet';
    transactionId?: string;
    paymentDate?: Date;
    receiptUrl?: string;
  };
  autoRenew: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    type: {
      type: String,
      enum: ['superadmin', 'additional_admin'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    billingCycle: {
      type: String,
      enum: ['yearly'],
      default: 'yearly',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'expired', 'cancelled'],
      required: true,
      default: 'pending',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ['card', 'upi', 'netbanking', 'wallet'],
      },
      transactionId: String,
      paymentDate: Date,
      receiptUrl: String,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionSchema.index({ organizationId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 }); // For renewal reminders

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);

// Pricing constants
export const SUBSCRIPTION_PRICING = {
  SUPERADMIN: 99999, // ₹99,999 per year
  ADDITIONAL_ADMIN: 15599, // ₹15,599 per year per additional admin/manager
} as const;
