import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { User } from '../models/User'
import { InviteCode } from '../models/InviteCode'
import { Organization } from '../models/Organization'
import { env } from '../config/env'

const router = Router()

// Web user registration (email + password)
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
})

router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = registerSchema.parse(req.body)
    const existing = await User.findOne({ email }).lean()
    if (existing) return res.status(409).json({ error: 'Email already in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      name,
      passwordHash,
      roles: ['member'],
      userType: 'web',
      isActive: true,
    })
    const token = jwt.sign(
      { id: user.id, roles: user.roles, organizationId: user.organizationId },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        userType: user.userType,
      },
    })
  } catch (err) {
    next(err)
  }
})

// Web user login (email + password)
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await User.findOne({ email, isActive: true })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    if (!user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    const token = jwt.sign(
      { id: user.id, roles: user.roles, organizationId: user.organizationId },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        userType: user.userType,
        organizationId: user.organizationId,
      },
    })
  } catch (err) {
    next(err)
  }
})

// Mobile user registration (phone + invite code)
const mobileRegisterSchema = z.object({
  phone: z.string().min(10).max(15),
  name: z.string().min(2),
  inviteCode: z.string().regex(/^#[A-Z0-9]{4}[0-9]{3}$/, 'Invalid invite code format'),
})

router.post('/mobile/register', async (req, res, next) => {
  try {
    const { phone, name, inviteCode: code } = mobileRegisterSchema.parse(req.body)

    // Check if phone already registered
    const existing = await User.findOne({ phone }).lean()
    if (existing) {
      return res.status(409).json({ error: 'Phone number already registered' })
    }

    // Verify invite code
    const inviteCode = await InviteCode.findOne({ code: code.toUpperCase() })
    if (!inviteCode) {
      return res.status(400).json({ error: 'Invalid invite code' })
    }

    if (inviteCode.status !== 'active') {
      return res.status(400).json({ error: 'Invite code is not active' })
    }

    if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
      inviteCode.status = 'expired'
      await inviteCode.save()
      return res.status(400).json({ error: 'Invite code has expired' })
    }

    if (inviteCode.currentUses >= inviteCode.maxUses) {
      inviteCode.status = 'used'
      await inviteCode.save()
      return res.status(400).json({ error: 'Invite code has been fully used' })
    }

    // Check organization subscription status
    const organization = await Organization.findById(inviteCode.organizationId)
    if (!organization) {
      return res.status(400).json({ error: 'Organization not found' })
    }

    if (organization.subscription.status !== 'active' && organization.subscription.status !== 'trial') {
      return res.status(400).json({ error: 'Organization subscription is not active' })
    }

    // Create mobile user
    const user = await User.create({
      phone,
      name,
      roles: [inviteCode.role],
      organizationId: inviteCode.organizationId,
      userType: 'mobile',
      inviteCodeUsed: code.toUpperCase(),
      isActive: true,
      lastLoginAt: new Date(),
    })

    // Update invite code usage
    inviteCode.currentUses += 1
    if (inviteCode.currentUses >= inviteCode.maxUses) {
      inviteCode.status = 'used'
    }
    if (!inviteCode.usedBy) {
      // Assign user id; cast to any to satisfy mongoose typings
      inviteCode.usedBy = user._id as any
      inviteCode.usedAt = new Date()
    }
    await inviteCode.save()

    // Auto-assign to group if specified
    if (inviteCode.metadata?.assignToGroup) {
      // This would be handled by the groups system
      // For now, we'll skip it
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, roles: user.roles, organizationId: user.organizationId },
      env.JWT_SECRET,
      { expiresIn: '30d' } // Mobile tokens last longer
    )

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        roles: user.roles,
        userType: user.userType,
        organizationId: user.organizationId,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        type: organization.type,
      },
      welcomeMessage: inviteCode.metadata?.welcomeMessage,
    })
  } catch (err) {
    next(err)
  }
})

// Mobile user login (phone only - passwordless)
const mobileLoginSchema = z.object({
  phone: z.string().min(10).max(15),
  // In production, you would add OTP verification here
})

router.post('/mobile/login', async (req, res, next) => {
  try {
    const { phone } = mobileLoginSchema.parse(req.body)

    // Find user by phone
    const user = await User.findOne({ phone, userType: 'mobile', isActive: true })
      .populate('organizationId', 'name type subscription')

    if (!user) {
      return res.status(401).json({ error: 'Phone number not registered' })
    }

    // Check organization status
    if (user.organizationId) {
      const org = user.organizationId as any
      if (org.subscription.status === 'expired') {
        return res.status(403).json({ error: 'Organization subscription has expired' })
      }
    }

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    // Generate token
    const token = jwt.sign(
      { id: user.id, roles: user.roles, organizationId: user.organizationId },
      env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        roles: user.roles,
        userType: user.userType,
        organizationId: user.organizationId,
      },
      organization: user.organizationId,
    })
  } catch (err) {
    next(err)
  }
})

export default router
