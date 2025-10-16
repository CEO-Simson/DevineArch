import { Schema, model, Document } from 'mongoose';

export interface IInviteCode extends Document {
  code: string; // Format: #xxxx000
  organizationId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId; // Admin/Manager who created the code
  role: 'member' | 'volunteer' | 'staff'; // Role assigned to user when they register
  status: 'active' | 'used' | 'expired' | 'revoked';
  usedBy?: Schema.Types.ObjectId; // Reference to User who used this code
  usedAt?: Date;
  expiresAt?: Date;
  maxUses: number; // Usually 1, but can be multiple for group invites
  currentUses: number;
  metadata?: {
    assignToGroup?: Schema.Types.ObjectId; // Auto-assign to specific group
    welcomeMessage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const inviteCodeSchema = new Schema<IInviteCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: /^#[A-Z0-9]{4}[0-9]{3}$/, // Pattern: #XXXX000
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['member', 'volunteer', 'staff'],
      default: 'member',
    },
    status: {
      type: String,
      enum: ['active', 'used', 'expired', 'revoked'],
      default: 'active',
    },
    usedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    usedAt: Date,
    expiresAt: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 6); // Codes expire after 6 months
        return date;
      },
    },
    maxUses: {
      type: Number,
      default: 1,
    },
    currentUses: {
      type: Number,
      default: 0,
    },
    metadata: {
      assignToGroup: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
      },
      welcomeMessage: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
inviteCodeSchema.index({ code: 1 }, { unique: true });
inviteCodeSchema.index({ organizationId: 1, status: 1 });
inviteCodeSchema.index({ expiresAt: 1 });

// Method to generate a unique invite code
inviteCodeSchema.statics.generateCode = async function (): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const digits = '0123456789';

  let code = '';
  let isUnique = false;

  while (!isUnique) {
    // Generate 4 alphanumeric characters
    let prefix = '';
    for (let i = 0; i < 4; i++) {
      prefix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Generate 3 digits
    let suffix = '';
    for (let i = 0; i < 3; i++) {
      suffix += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    code = `#${prefix}${suffix}`;

    // Check if code already exists
    const existing = await this.findOne({ code });
    if (!existing) {
      isUnique = true;
    }
  }

  return code;
};

export const InviteCode = model<IInviteCode>('InviteCode', inviteCodeSchema);
