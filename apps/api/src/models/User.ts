import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  passwordHash?: string // Optional for mobile-only users
  phone?: string // Mobile number for app users
  roles: string[] // owner, admin, staff, volunteer, member, mobile_user
  organizationId?: Schema.Types.ObjectId // Link to organization
  userType: 'web' | 'mobile' // Distinguish between web and mobile users
  inviteCodeUsed?: string // Track which invite code was used
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: function(this: IUser) {
        return this.userType === 'web'; // Email required only for web users
      },
      unique: true,
      sparse: true, // Allow multiple null values
      index: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    passwordHash: {
      type: String,
      required: function(this: IUser) {
        return this.userType === 'web'; // Password required only for web users
      }
    },
    phone: {
      type: String,
      required: function(this: IUser) {
        return this.userType === 'mobile'; // Phone required for mobile users
      },
      unique: true,
      sparse: true,
      trim: true,
    },
    roles: { type: [String], default: ['member'] },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    userType: {
      type: String,
      enum: ['web', 'mobile'],
      default: 'web',
    },
    inviteCodeUsed: {
      type: String,
      uppercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
)

// Compound indexes
userSchema.index({ organizationId: 1, isActive: 1 });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

export const User = model<IUser>('User', userSchema)

// Role hierarchy for reference
export const USER_ROLES = {
  OWNER: 'owner', // Super admin (Diocese/Bishop) - owns organization
  ADMIN: 'admin', // Admin/Manager - can manage users and settings
  STAFF: 'staff', // Staff member
  VOLUNTEER: 'volunteer', // Volunteer
  MEMBER: 'member', // Regular member
  MOBILE_USER: 'mobile_user', // Mobile app user (church member)
} as const;
