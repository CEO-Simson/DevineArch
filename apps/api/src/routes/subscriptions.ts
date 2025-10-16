import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, AuthedRequest } from '../middleware/auth'
import { Subscription, SUBSCRIPTION_PRICING } from '../models/Subscription'
import { Organization } from '../models/Organization'
import { User } from '../models/User'

const router = Router()

// Apply auth middleware to all routes
router.use(requireAuth)

// Validation schemas
const createPaymentSchema = z.object({
  type: z.enum(['superadmin', 'additional_admin']),
  quantity: z.number().int().min(1).optional(), // For additional admin seats
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'imps', 'wallet']),
  transactionId: z.string().min(1),
  upiId: z.string().optional(), // e.g., name@bank
  bank: z.string().optional(), // for netbanking
  provider: z.enum(['razorpay']).default('razorpay'),
});

const confirmPaymentSchema = z.object({
  transactionId: z.string().min(1),
  receiptUrl: z.string().url().optional(),
});

// GET /api/subscriptions - Get all subscriptions for user's organization
router.get('/', async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    // Check if user has permission (owner or admin)
    if (!user.roles.includes('owner') && !user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Only owners and admins can view subscriptions' })
    }

  const status = req.query.status as string | undefined
  const filter: any = { organizationId: user.organizationId }

    if (status) {
      filter.status = status
    }

    const subscriptions = await Subscription.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)

    res.json({ subscriptions, count: subscriptions.length })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    res.status(500).json({ error: 'Failed to fetch subscriptions' })
  }
});

// GET /api/subscriptions/active - Get active subscription
router.get('/active', async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    const organization = await Organization.findById(user.organizationId)
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    const subscription = await Subscription.findOne({
      organizationId: user.organizationId,
      type: 'superadmin',
      status: 'active',
    }).sort({ createdAt: -1 })

    res.json({
      subscription,
      organization: {
        subscriptionStatus: organization.subscription.status,
        endDate: organization.subscription.endDate,
        autoRenew: organization.subscription.autoRenew,
      },
    })
  } catch (error) {
    console.error('Error fetching active subscription:', error)
    res.status(500).json({ error: 'Failed to fetch active subscription' })
  }
});

// GET /api/subscriptions/status - active | grace | expired with days
router.get('/status', async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) return res.status(400).json({ error: 'User is not associated with any organization' })

    const organization = await Organization.findById(user.organizationId)
    if (!organization) return res.status(404).json({ error: 'Organization not found' })

    const now = new Date()
    const end = new Date(organization.subscription.endDate)
    const msPerDay = 1000 * 60 * 60 * 24
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / msPerDay)
    const graceDays = 30

    let state: 'active' | 'grace' | 'expired'
    let daysRemaining: number | undefined
    let daysPastDue: number | undefined

    if (diffDays >= 0 && organization.subscription.status === 'active') {
      state = 'active'
      daysRemaining = diffDays
    } else if (diffDays < 0 && Math.abs(diffDays) <= graceDays) {
      state = 'grace'
      daysPastDue = Math.abs(diffDays)
    } else {
      state = 'expired'
      daysPastDue = Math.abs(diffDays)
    }

    res.json({
      state,
      daysRemaining,
      daysPastDue,
      graceDays,
      subscriptionEndDate: organization.subscription.endDate,
      autoRenew: organization.subscription.autoRenew,
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    res.status(500).json({ error: 'Failed to fetch subscription status' })
  }
})

// GET /api/subscriptions/pricing - Get pricing information
router.get('/pricing', async (_req, res) => {
  try {
    const pricing = {
      superadmin: {
        amount: SUBSCRIPTION_PRICING.SUPERADMIN,
        currency: 'INR',
        billingCycle: 'yearly',
        features: [
          '2 Admin/Manager seats included',
          'Unlimited church members',
          'Mobile app access',
          'Complete people management',
          'Giving & donation tracking',
          'Reports & analytics',
          'Single branch/parish',
        ],
      },
      additionalAdmin: {
        amount: SUBSCRIPTION_PRICING.ADDITIONAL_ADMIN,
        currency: 'INR',
        billingCycle: 'yearly',
        features: [
          '1 Additional Admin/Manager seat',
          'Can manage additional branch churches',
          'Full administrative access',
        ],
      },
    };

    res.json({ pricing })
  } catch (error) {
    console.error('Error fetching pricing:', error)
    res.status(500).json({ error: 'Failed to fetch pricing' })
  }
});

// POST /api/subscriptions/initiate - Initiate a subscription payment
router.post('/initiate', async (req: AuthedRequest, res) => {
  try {
  const data = createPaymentSchema.parse(req.body)

    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    // Only owner can initiate payments
    if (!user.roles.includes('owner')) {
      return res.status(403).json({ error: 'Only organization owner can initiate payments' })
    }

    const organization = await Organization.findById(user.organizationId)
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    // Calculate amount
  let amount: number
  let notes: string | undefined

    if (data.type === 'superadmin') {
      amount = SUBSCRIPTION_PRICING.SUPERADMIN
    } else {
      const quantity = data.quantity || 1
      amount = SUBSCRIPTION_PRICING.ADDITIONAL_ADMIN * quantity
      notes = `${quantity} additional admin seat(s)`
    }

    // Calculate subscription dates
  const startDate = new Date()
  const endDate = new Date(startDate)
  endDate.setFullYear(endDate.getFullYear() + 1)

    // Create subscription record
    const subscription = new Subscription({
      organizationId: user.organizationId,
      type: data.type,
      amount,
      status: 'pending',
      startDate,
      endDate,
      paymentDetails: {
        method: data.paymentMethod,
        transactionId: data.transactionId,
      },
      autoRenew: true,
      notes,
  })

  await subscription.save()

    res.status(201).json({
          message: 'Payment initiated successfully',
          subscription,
          paymentIntent: {
            provider: data.provider,
            method: data.paymentMethod,
            amount,
            currency: 'INR',
            transactionId: data.transactionId,
            upiId: data.upiId,
            bank: data.bank,
            // In a real integration, include Razorpay order_id/redirect URL/QR payload
            redirectUrl: data.paymentMethod === 'card' || data.paymentMethod === 'netbanking' ? 'https://checkout.razorpay.com/v1/checkout.js' : undefined,
            upiQrData: data.paymentMethod === 'upi' ? 'upi://pay?pa=demo@bank&am=' + amount : undefined,
          },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    console.error('Error initiating payment:', error)
    res.status(500).json({ error: 'Failed to initiate payment' })
  }
});

// POST /api/subscriptions/:id/confirm - Confirm a subscription payment
router.post('/:id/confirm', async (req: AuthedRequest, res) => {
  try {
  const data = confirmPaymentSchema.parse(req.body)

    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    // Only owner can confirm payments
    if (!user.roles.includes('owner')) {
      return res.status(403).json({ error: 'Only organization owner can confirm payments' })
    }

    const subscription = await Subscription.findById(req.params.id)
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    if (subscription.organizationId.toString() !== user.organizationId.toString()) {
      return res.status(403).json({ error: 'Access denied' })
    }

    if (subscription.status !== 'pending') {
      return res.status(400).json({ error: 'Subscription is not pending confirmation' })
    }

    // Verify transaction ID matches
    if (subscription.paymentDetails.transactionId !== data.transactionId) {
      return res.status(400).json({ error: 'Transaction ID mismatch' })
    }

    // Update subscription status
    subscription.status = 'active'
    subscription.paymentDetails.paymentDate = new Date()
    if (data.receiptUrl) {
      subscription.paymentDetails.receiptUrl = data.receiptUrl
    }
    await subscription.save()

    // Update organization subscription status
    const organization = await Organization.findById(user.organizationId)
    if (organization) {
      organization.subscription.status = 'active'
      organization.subscription.startDate = subscription.startDate
      organization.subscription.endDate = subscription.endDate

      // If additional admin seats, update the count
      if (subscription.type === 'additional_admin') {
        // Already updated in the organizations route
      }

      await organization.save()
    }

    res.json({
      message: 'Payment confirmed successfully',
      subscription,
      organization,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    console.error('Error confirming payment:', error)
    res.status(500).json({ error: 'Failed to confirm payment' })
  }
});

// POST /api/subscriptions/:id/cancel - Cancel a subscription
router.post('/:id/cancel', async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    // Only owner can cancel subscriptions
    if (!user.roles.includes('owner')) {
      return res.status(403).json({ error: 'Only organization owner can cancel subscriptions' })
    }

    const subscription = await Subscription.findById(req.params.id)
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' })
    }

    if (subscription.organizationId.toString() !== user.organizationId.toString()) {
      return res.status(403).json({ error: 'Access denied' })
    }

    subscription.status = 'cancelled'
    subscription.autoRenew = false
    await subscription.save()

    // Update organization
    const organization = await Organization.findById(user.organizationId)
    if (organization) {
      organization.subscription.autoRenew = false
      await organization.save()
    }

    res.json({
      message: 'Subscription cancelled successfully',
      subscription,
    })
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
});

// GET /api/subscriptions/upcoming-renewals - Get subscriptions expiring soon
router.get('/upcoming-renewals', async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    if (!user.roles.includes('owner') && !user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Only owners and admins can view upcoming renewals' })
    }

    // Find subscriptions expiring in the next 30 days
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const upcomingRenewals = await Subscription.find({
      organizationId: user.organizationId,
      status: 'active',
      endDate: { $lte: thirtyDaysFromNow },
      autoRenew: true,
    }).sort({ endDate: 1 })

    res.json({ upcomingRenewals, count: upcomingRenewals.length })
  } catch (error) {
    console.error('Error fetching upcoming renewals:', error)
    res.status(500).json({ error: 'Failed to fetch upcoming renewals' })
  }
});

export { router as subscriptionsRouter }
