import { Schema, model, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  type: 'diocese' | 'parish';
  subscriptionTier: 'superadmin' | 'admin';
  parentOrganizationId?: Schema.Types.ObjectId;
  ownerId: Schema.Types.ObjectId; // Reference to User who owns this org
  settings: {
    maxAdminSeats: number;
    usedAdminSeats: number;
    allowedBranches: number;
  };
  subscription: {
    status: 'active' | 'expired' | 'trial' | 'cancelled';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
  };
  contactInfo: {
    email: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['diocese', 'parish'],
      required: true,
      default: 'parish',
    },
    subscriptionTier: {
      type: String,
      enum: ['superadmin', 'admin'],
      required: true,
    },
    parentOrganizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    settings: {
      maxAdminSeats: {
        type: Number,
        required: true,
        default: 2, // SuperAdmin gets 2 free admin/manager seats
      },
      usedAdminSeats: {
        type: Number,
        required: true,
        default: 0,
      },
      allowedBranches: {
        type: Number,
        required: true,
        default: 1,
      },
    },
    subscription: {
      status: {
        type: String,
        enum: ['active', 'expired', 'trial', 'cancelled'],
        required: true,
        default: 'trial',
      },
      startDate: {
        type: Date,
        required: true,
        default: Date.now,
      },
      endDate: {
        type: Date,
        required: true,
        default: () => {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          return date;
        },
      },
      autoRenew: {
        type: Boolean,
        default: true,
      },
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: {
          type: String,
          default: 'India',
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
organizationSchema.index({ ownerId: 1 });
organizationSchema.index({ parentOrganizationId: 1 });
organizationSchema.index({ 'subscription.status': 1, 'subscription.endDate': 1 });

export const Organization = model<IOrganization>('Organization', organizationSchema);
