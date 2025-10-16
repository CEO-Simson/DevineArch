import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, AuthedRequest } from '../middleware/auth.js'
import { Organization } from '../models/Organization.js'
import { Subscription, SUBSCRIPTION_PRICING } from '../models/Subscription.js'
import { User } from '../models/User.js'

const router = Router()

// Apply auth middleware to all routes
router.use(requireAuth)

// Validation schemas
const createOrganizationSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['diocese', 'parish']),
  subscriptionTier: z.enum(['superadmin', 'admin']),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default('India'),
  }).optional(),
});

const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
});

const addAdminSeatSchema = z.object({
  quantity: z.number().int().min(1).max(50),
});

// POST /api/organizations - Create a new organization
router.post('/', async (req: AuthedRequest, res) => {
  try {
    const data = createOrganizationSchema.parse(req.body);

    // Check if user already owns an organization
  const existingOrg = await Organization.findOne({ ownerId: req.user!.id })
    if (existingOrg) {
  return res.status(400).json({ error: 'User already owns an organization' })
    }

    // Determine settings based on subscription tier
    const settings = {
      maxAdminSeats: data.subscriptionTier === 'superadmin' ? 2 : 0,
      usedAdminSeats: 0,
      allowedBranches: 1,
    }

    // Calculate subscription end date (1 year from now)
  const startDate = new Date()
  const endDate = new Date(startDate)
  endDate.setFullYear(endDate.getFullYear() + 1)

    const organization = new Organization({
      name: data.name,
      type: data.type,
      subscriptionTier: data.subscriptionTier,
      ownerId: req.user!.id,
      settings,
      subscription: {
        status: 'trial', // Start with trial, update to active after payment
        startDate,
        endDate,
        autoRenew: true,
      },
      contactInfo: {
        email: data.contactEmail,
        phone: data.contactPhone,
        address: data.address,
      },
  })

  await organization.save()

    // Update user to set organizationId and role
    await User.findByIdAndUpdate(req.user!.id, {
      organizationId: organization._id,
      roles: ['owner'],
    })

    // Create initial subscription record
    const subscriptionAmount = data.subscriptionTier === 'superadmin'
      ? SUBSCRIPTION_PRICING.SUPERADMIN
  : 0

    if (subscriptionAmount > 0) {
      const subscription = new Subscription({
        organizationId: organization._id,
        type: 'superadmin',
        amount: subscriptionAmount,
        status: 'pending',
        startDate,
        endDate,
        autoRenew: true,
      })
      await subscription.save()
    }

    res.status(201).json({ organization })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    console.error('Error creating organization:', error)
    res.status(500).json({ error: 'Failed to create organization' })
  }
});

// GET /api/organizations/me - Get current user's organization
router.get('/me', async (req: AuthedRequest, res) => {
  try {
  const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(404).json({ error: 'User is not associated with any organization' })
    }

    const organization = await Organization.findById(user.organizationId)
      .populate('ownerId', 'name email')

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    res.json({ organization })
  } catch (error) {
    console.error('Error fetching organization:', error)
    res.status(500).json({ error: 'Failed to fetch organization' })
  }
});

// GET /api/organizations/:id - Get organization by ID
router.get('/:id', async (req: AuthedRequest, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('ownerId', 'name email')

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    // Check if user has access to this organization
    const user = await User.findById(req.user!.id)
    // use the Mongoose virtual 'id' (string) instead of calling toString() on _id
    if (user?.organizationId?.toString() !== organization.id &&
        !user?.roles.includes('owner')) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json({ organization })
  } catch (error) {
    console.error('Error fetching organization:', error)
    res.status(500).json({ error: 'Failed to fetch organization' })
  }
});

// PATCH /api/organizations/:id - Update organization
router.patch('/:id', async (req: AuthedRequest, res) => {
  try {
    const data = updateOrganizationSchema.parse(req.body);

    const organization = await Organization.findById(req.params.id)
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    // Check if user is the owner
    if (organization.ownerId.toString() !== req.user!.id) {
      return res.status(403).json({ error: 'Only the organization owner can update details' })
    }

    // Update fields
    if (data.name) organization.name = data.name;
    if (data.contactEmail) organization.contactInfo.email = data.contactEmail;
    if (data.contactPhone) organization.contactInfo.phone = data.contactPhone;
    if (data.address) organization.contactInfo.address = data.address;

    await organization.save()

    res.json({ organization })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    console.error('Error updating organization:', error)
    res.status(500).json({ error: 'Failed to update organization' })
  }
});

// POST /api/organizations/:id/admin-seats - Purchase additional admin seats
router.post('/:id/admin-seats', async (req: AuthedRequest, res) => {
  try {
    const data = addAdminSeatSchema.parse(req.body);

    const organization = await Organization.findById(req.params.id)
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    // Check if user is the owner
    if (organization.ownerId.toString() !== req.user!.id) {
      return res.status(403).json({ error: 'Only the organization owner can purchase admin seats' })
    }

    // Check if organization has active subscription
    if (organization.subscription.status !== 'active') {
      return res.status(400).json({ error: 'Organization must have an active subscription' })
    }

    // Calculate amount
  const amount = SUBSCRIPTION_PRICING.ADDITIONAL_ADMIN * data.quantity

    // Create subscription record
    const endDate = new Date(organization.subscription.endDate)
    const subscription = new Subscription({
      organizationId: organization._id,
      type: 'additional_admin',
      amount,
      status: 'pending',
      startDate: new Date(),
      endDate,
      autoRenew: true,
      notes: `${data.quantity} additional admin seat(s)`,
    })

    await subscription.save()

    // Update organization settings (will be activated after payment)
  organization.settings.maxAdminSeats += data.quantity
  await organization.save()

    res.json({
      message: 'Admin seats added successfully',
      subscription,
      organization,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    console.error('Error adding admin seats:', error)
    res.status(500).json({ error: 'Failed to add admin seats' })
  }
});

// GET /api/organizations/:id/stats - Get organization statistics
router.get('/:id/stats', async (req: AuthedRequest, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    // Check if user has access
    const user = await User.findById(req.user!.id)
    // use the Mongoose virtual 'id' (string) instead of calling toString() on _id
    if (user?.organizationId?.toString() !== organization.id) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    // Count users by role
    const totalUsers = await User.countDocuments({
      organizationId: organization._id,
      isActive: true,
    })

    const adminUsers = await User.countDocuments({
      organizationId: organization._id,
      roles: { $in: ['admin', 'owner'] },
      isActive: true,
    })

    const mobileUsers = await User.countDocuments({
      organizationId: organization._id,
      userType: 'mobile',
      isActive: true,
    })

    // Calculate days until renewal
    const today = new Date()
    const daysUntilRenewal = Math.ceil(
      (organization.subscription.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    const stats = {
      totalUsers,
      adminUsers,
      mobileUsers,
      maxAdminSeats: organization.settings.maxAdminSeats,
      usedAdminSeats: organization.settings.usedAdminSeats,
      availableAdminSeats: organization.settings.maxAdminSeats - organization.settings.usedAdminSeats,
      subscriptionStatus: organization.subscription.status,
      daysUntilRenewal,
      subscriptionEndDate: organization.subscription.endDate,
    }

    res.json({ stats })
  } catch (error) {
    console.error('Error fetching organization stats:', error)
    res.status(500).json({ error: 'Failed to fetch organization stats' })
  }
});

export { router as organizationsRouter }
