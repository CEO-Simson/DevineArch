import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, AuthedRequest } from '../middleware/auth.js'
import { InviteCode } from '../models/InviteCode.js'
import { Organization } from '../models/Organization.js'
import { User } from '../models/User.js'

const router = Router()

// Public: verify invite code before requiring auth
const verifyInviteSchema = z.object({
  code: z.string().regex(/^#[A-Z0-9]{4}[0-9]{3}$/, 'Invalid invite code format'),
})

router.get('/verify/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase()

    const inviteCode = await InviteCode.findOne({ code }).populate('organizationId', 'name type')
    if (!inviteCode) return res.status(404).json({ error: 'Invalid invite code' })

    if (inviteCode.status !== 'active') return res.status(400).json({ error: 'Invite code is no longer active' })
    if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
      inviteCode.status = 'expired'
      await inviteCode.save()
      return res.status(400).json({ error: 'Invite code has expired' })
    }
    if (inviteCode.currentUses >= inviteCode.maxUses) {
      inviteCode.status = 'used'
      await inviteCode.save()
      return res.status(400).json({ error: 'Invite code has reached maximum uses' })
    }

    res.json({
      valid: true,
      code: inviteCode.code,
      organization: inviteCode.organizationId,
      role: inviteCode.role,
      welcomeMessage: inviteCode.metadata?.welcomeMessage,
    })
  } catch (error) {
    console.error('Error verifying invite code:', error)
    res.status(500).json({ error: 'Failed to verify invite code' })
  }
})

// Authenticated routes below
router.use(requireAuth)

// Validation schemas
const createInviteSchema = z.object({
  role: z.enum(['member', 'volunteer', 'staff']).default('member'),
  maxUses: z.number().int().min(1).max(100).default(1),
  expiresInDays: z.number().int().min(1).max(365).optional(),
  assignToGroup: z.string().optional(),
  welcomeMessage: z.string().max(500).optional(),
});

const bulkCreateInvitesSchema = z.object({
  quantity: z.number().int().min(1).max(100),
  role: z.enum(['member', 'volunteer', 'staff']).default('member'),
  maxUses: z.number().int().min(1).default(1),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

// POST /api/invites - Create a new invite code
router.post('/', async (req: AuthedRequest, res) => {
  try {
    const data = createInviteSchema.parse(req.body);

    // Get user and organization
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    // Check if user has permission to create invites (admin or owner)
    if (!user.roles.includes('admin') && !user.roles.includes('owner')) {
      return res.status(403).json({ error: 'Only admins and owners can create invite codes' })
    }

    const organization = await Organization.findById(user.organizationId)
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    // Check subscription status
    if (organization.subscription.status !== 'active' && organization.subscription.status !== 'trial') {
      return res.status(400).json({ error: 'Organization subscription is not active' })
    }

    // Generate unique code
  const code = await (InviteCode as any).generateCode()

    // Calculate expiration date
    let expiresAt: Date | undefined
    if (data.expiresInDays) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + data.expiresInDays)
    }

    const inviteCode = new InviteCode({
      code,
      organizationId: user.organizationId,
      createdBy: req.user!.id,
      role: data.role,
      maxUses: data.maxUses,
      expiresAt,
      metadata: {
        assignToGroup: data.assignToGroup,
        welcomeMessage: data.welcomeMessage,
      },
    })

    await inviteCode.save()

    res.status(201).json({ inviteCode })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    console.error('Error creating invite code:', error)
    res.status(500).json({ error: 'Failed to create invite code' })
  }
});

// POST /api/invites/bulk - Create multiple invite codes
router.post('/bulk', async (req: AuthedRequest, res) => {
  try {
  const data = bulkCreateInvitesSchema.parse(req.body)

    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    if (!user.roles.includes('admin') && !user.roles.includes('owner')) {
      return res.status(403).json({ error: 'Only admins and owners can create invite codes' })
    }

    const organization = await Organization.findById(user.organizationId)
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    if (organization.subscription.status !== 'active' && organization.subscription.status !== 'trial') {
      return res.status(400).json({ error: 'Organization subscription is not active' })
    }

    // Generate multiple codes
    const inviteCodes: any[] = []
    let expiresAt: Date | undefined
    if (data.expiresInDays) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + data.expiresInDays)
    }

    for (let i = 0; i < data.quantity; i++) {
  const code = await (InviteCode as any).generateCode()

      const inviteCode = new InviteCode({
        code,
        organizationId: user.organizationId,
        createdBy: req.user!.id,
        role: data.role,
        maxUses: data.maxUses,
        expiresAt,
      })

      await inviteCode.save()
      inviteCodes.push(inviteCode)
    }

    res.status(201).json({ inviteCodes, count: inviteCodes.length })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    console.error('Error creating bulk invite codes:', error)
    res.status(500).json({ error: 'Failed to create bulk invite codes' })
  }
});

// GET /api/invites - List all invite codes for organization
router.get('/', async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    if (!user.roles.includes('admin') && !user.roles.includes('owner')) {
      return res.status(403).json({ error: 'Only admins and owners can view invite codes' })
    }

  const status = req.query.status as string | undefined
  const filter: any = { organizationId: user.organizationId }

    if (status) {
      filter.status = status
    }

    const inviteCodes = await InviteCode.find(filter)
      .populate('createdBy', 'name email')
      .populate('usedBy', 'name phone')
      .sort({ createdAt: -1 })
      .limit(100)

    res.json({ inviteCodes, count: inviteCodes.length })
  } catch (error) {
    console.error('Error fetching invite codes:', error)
    res.status(500).json({ error: 'Failed to fetch invite codes' })
  }
});

// PATCH /api/invites/:id/revoke - Revoke an invite code
router.patch('/:id/revoke', async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    if (!user.roles.includes('admin') && !user.roles.includes('owner')) {
      return res.status(403).json({ error: 'Only admins and owners can revoke invite codes' })
    }

    const inviteCode = await InviteCode.findById(req.params.id)
    if (!inviteCode) {
      return res.status(404).json({ error: 'Invite code not found' })
    }

    // Check if invite belongs to user's organization
    if (inviteCode.organizationId.toString() !== user.organizationId.toString()) {
      return res.status(403).json({ error: 'Access denied' })
    }

    inviteCode.status = 'revoked'
    await inviteCode.save()

    res.json({ message: 'Invite code revoked successfully', inviteCode })
  } catch (error) {
    console.error('Error revoking invite code:', error)
    res.status(500).json({ error: 'Failed to revoke invite code' })
  }
});

// GET /api/invites/stats - Get invite statistics
router.get('/stats', async (req: AuthedRequest, res) => {
  try {
    const user = await User.findById(req.user!.id)
    if (!user?.organizationId) {
      return res.status(400).json({ error: 'User is not associated with any organization' })
    }

    if (!user.roles.includes('admin') && !user.roles.includes('owner')) {
      return res.status(403).json({ error: 'Only admins and owners can view invite statistics' })
    }

    const [active, used, expired, revoked, totalUses] = await Promise.all([
      InviteCode.countDocuments({ organizationId: user.organizationId, status: 'active' }),
      InviteCode.countDocuments({ organizationId: user.organizationId, status: 'used' }),
      InviteCode.countDocuments({ organizationId: user.organizationId, status: 'expired' }),
      InviteCode.countDocuments({ organizationId: user.organizationId, status: 'revoked' }),
      InviteCode.aggregate([
        { $match: { organizationId: user.organizationId } },
        { $group: { _id: null, total: { $sum: '$currentUses' } } },
      ]),
    ])

    const stats = {
      active,
      used,
      expired,
      revoked,
      total: active + used + expired + revoked,
      totalRegistrations: totalUses[0]?.total || 0,
    }

    res.json({ stats })
  } catch (error) {
    console.error('Error fetching invite statistics:', error)
    res.status(500).json({ error: 'Failed to fetch invite statistics' })
  }
});

export { router as invitesRouter }
