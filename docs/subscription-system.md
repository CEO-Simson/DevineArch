# TIMA Church Subscription System

## Overview

The TIMA Church Management System implements a multi-tier subscription model designed for dioceses, parishes, and church branches across India.

## Subscription Tiers

### Super Admin (Diocese/Bishop) - ₹99,999/year

**Included Features:**
- 2 Admin/Manager seats included
- Unlimited church members
- Mobile app access for all members
- Complete people management
- Giving & donation tracking
- Reports & analytics
- Single branch/parish management

**Target Users:**
- Diocese headquarters
- Bishop's office
- Large parish churches

### Additional Admin/Manager Seats - ₹15,599/year each

**Features:**
- Add extra Admin/Manager login
- Manage additional branch churches
- Full administrative access
- Independent user management

**Use Case:**
When a diocese needs to manage multiple branch churches, they can purchase additional admin seats. Each additional seat allows managing a separate branch.

## User Hierarchy

```
Super Admin (Owner)
  ├── Admin/Manager (2 included, more can be purchased)
  │   ├── Staff
  │   ├── Volunteers
  │   └── Members
  └── Mobile App Users (unlimited)
```

### Role Definitions

1. **Owner (Super Admin)**
   - Diocese/Bishop level
   - Full system control
   - Purchase subscriptions and admin seats
   - Manage all organizations and users
   - Access to all features

2. **Admin/Manager**
   - Church/Branch administrators
   - Manage local users
   - Create invite codes
   - View reports and analytics
   - Manage giving and people data

3. **Staff**
   - Church staff members
   - Limited administrative access
   - Can view and update records

4. **Volunteer**
   - Church volunteers
   - Basic access to features
   - Can participate in groups and events

5. **Member**
   - Regular church members
   - Basic member features
   - Can view information

6. **Mobile User**
   - Mobile app only users
   - Connected via invite code
   - Access via phone number

## Invite Code System

### Format: #XXXX000

- First 4 characters: Alphanumeric (A-Z, 0-9)
- Last 3 characters: Numeric (0-9)
- Example: `#AB12345`, `#XYZW001`

### How It Works

1. **Admin Creates Invite Code**
   - Admin/Manager generates invite codes via web dashboard
   - Can create single or bulk codes
   - Set expiration date (optional)
   - Assign default role (member/volunteer/staff)
   - Set max uses per code

2. **User Registration**
   - Download TIMA Church app from Play Store/App Store
   - Enter invite code
   - Verify code with backend
   - Enter name and phone number
   - Account created and linked to organization

3. **First Login**
   - User enters phone number
   - System authenticates (OTP in production)
   - Access granted to church features

## Mobile App Features

### Available on:
- Google Play Store (Android)
- Apple App Store (iOS)

### User Features:
- Directory: View church members
- Groups: Participate in church groups
- Events: View and RSVP to events
- Giving: Make donations
- Announcements: Receive church updates
- Profile: Manage personal information

## Database Schema

### Organizations
```typescript
{
  name: string
  type: 'diocese' | 'parish'
  subscriptionTier: 'superadmin' | 'admin'
  ownerId: ObjectId // Reference to User
  settings: {
    maxAdminSeats: number
    usedAdminSeats: number
    allowedBranches: number
  }
  subscription: {
    status: 'active' | 'expired' | 'trial' | 'cancelled'
    startDate: Date
    endDate: Date
    autoRenew: boolean
  }
  contactInfo: {
    email: string
    phone: string
    address: object
  }
}
```

### Subscriptions
```typescript
{
  organizationId: ObjectId
  type: 'superadmin' | 'additional_admin'
  amount: number // in INR
  currency: 'INR'
  billingCycle: 'yearly'
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  startDate: Date
  endDate: Date
  paymentDetails: {
    method: 'card' | 'upi' | 'netbanking' | 'wallet'
    transactionId: string
    paymentDate: Date
    receiptUrl: string
  }
}
```

### Invite Codes
```typescript
{
  code: string // #XXXX000
  organizationId: ObjectId
  createdBy: ObjectId // Admin who created it
  role: 'member' | 'volunteer' | 'staff'
  status: 'active' | 'used' | 'expired' | 'revoked'
  usedBy: ObjectId // User who used it
  expiresAt: Date
  maxUses: number
  currentUses: number
}
```

### Users
```typescript
{
  email?: string // For web users
  phone?: string // For mobile users
  name: string
  passwordHash?: string // For web users only
  roles: string[]
  organizationId: ObjectId
  userType: 'web' | 'mobile'
  inviteCodeUsed?: string
  isActive: boolean
  lastLoginAt: Date
}
```

## API Endpoints

### Organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations/me` - Get user's organization
- `GET /api/organizations/:id` - Get organization by ID
- `PATCH /api/organizations/:id` - Update organization
- `POST /api/organizations/:id/admin-seats` - Purchase admin seats
- `GET /api/organizations/:id/stats` - Get organization statistics

### Subscriptions
- `GET /api/subscriptions` - List subscriptions
- `GET /api/subscriptions/active` - Get active subscription
- `GET /api/subscriptions/pricing` - Get pricing info
- `POST /api/subscriptions/initiate` - Initiate payment
- `POST /api/subscriptions/:id/confirm` - Confirm payment
- `POST /api/subscriptions/:id/cancel` - Cancel subscription
- `GET /api/subscriptions/upcoming-renewals` - Get renewal reminders

### Invite Codes
- `POST /api/invites` - Create invite code
- `POST /api/invites/bulk` - Create multiple codes
- `GET /api/invites` - List all codes
- `GET /api/invites/verify/:code` - Verify code (public)
- `PATCH /api/invites/:id/revoke` - Revoke code
- `GET /api/invites/stats` - Get invite statistics

### Mobile Authentication
- `POST /api/auth/mobile/register` - Register mobile user
- `POST /api/auth/mobile/login` - Login mobile user

## Subscription Workflow

### Initial Setup

1. **Diocese Registration**
   - Bishop/Admin creates account on web
   - Selects "Super Admin" subscription tier
   - Enters organization details
   - Initiates payment (₹99,999)
   - Account activated after payment

2. **Admin Setup**
   - 2 admin seats included by default
   - Owner invites admins via email
   - Admins create accounts
   - Linked to organization automatically

### Adding Branch Churches

1. **Purchase Additional Admin Seat**
   - Owner navigates to subscription settings
   - Selects "Add Admin Seat"
   - Initiates payment (₹15,599/year)
   - New seat activated after payment

2. **Assign Admin to Branch**
   - Owner invites new admin
   - Admin creates account
   - Admin manages specific branch church
   - Can create invite codes for their members

### Member Onboarding

1. **Admin Creates Invite Codes**
   - Generate single or bulk codes
   - Set expiration and role
   - Share codes with members

2. **Members Join via App**
   - Download TIMA Church app
   - Enter invite code
   - Register with phone number
   - Start using church features

## Payment Integration

### Supported Methods
- Credit/Debit Cards
- UPI
- Net Banking
- Digital Wallets

### Payment Flow
1. User selects subscription tier
2. System calculates amount
3. Redirect to payment gateway
4. User completes payment
5. Webhook receives confirmation
6. Subscription activated
7. Receipt sent via email

## Renewal Process

### Auto-Renewal
- Enabled by default
- 30 days before expiry: Reminder email sent
- 7 days before expiry: Final reminder
- On expiry date: Auto-charge attempted
- If successful: Subscription renewed
- If failed: Grace period of 7 days

### Manual Renewal
- Admin can disable auto-renewal
- Renewal reminder sent 30 days before
- Admin manually initiates payment
- Subscription extended after payment

### Expired Subscription
- Access limited to read-only mode
- Cannot create new invite codes
- Cannot add new users
- Mobile app users see "Contact your church" message
- 30-day grace period before data archival

## Pricing Structure

| Item | Annual Price (INR) | Included |
|------|-------------------|----------|
| Super Admin (Diocese) | ₹99,999 | 2 Admin seats, Unlimited members, 1 branch |
| Additional Admin Seat | ₹15,599 | 1 Admin seat, 1 additional branch |

## Support & Maintenance

### Included in Subscription
- 24/7 technical support
- Regular updates
- Security patches
- Data backup
- 99.9% uptime SLA

### Additional Services (Optional)
- Custom integrations
- Data migration
- Training sessions
- Dedicated support

## Security & Compliance

- Data encrypted in transit (HTTPS)
- Data encrypted at rest
- Regular security audits
- GDPR compliance (for international users)
- Indian data residency

## Roadmap

### Phase 1 (Current)
- [x] Organization management
- [x] Subscription system
- [x] Invite code system
- [x] Mobile app (basic)
- [x] User hierarchy

### Phase 2 (Upcoming)
- [ ] Online payment integration (Razorpay/Stripe)
- [ ] SMS OTP for mobile login
- [ ] Push notifications
- [ ] Advanced reporting
- [ ] Custom fields

### Phase 3 (Future)
- [ ] Multi-language support
- [ ] WhatsApp integration
- [ ] Video streaming for services
- [ ] Mobile check-in with QR codes
- [ ] Accounting integration

## Contact

For questions or support:
- Email: support@timachurch.com
- Phone: +91-XXXX-XXXXXX
- Website: https://timachurch.com
