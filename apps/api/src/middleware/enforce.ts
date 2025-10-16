import { NextFunction, Response } from 'express'
import { AuthedRequest } from './auth'
import { Organization } from '../models/Organization'

// Ensures org is active or within 30-day grace
export async function requireActiveOrGrace(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const orgId = (req as any).user?.organizationId
    // Allow if no org context yet
    if (!orgId) return next()
    const org = await Organization.findById(orgId)
    if (!org) return res.status(403).json({ error: 'Organization not found' })

    const now = new Date()
    const end = new Date(org.subscription.endDate)
    const msPerDay = 1000 * 60 * 60 * 24
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / msPerDay)
    const graceDays = 30

    if (org.subscription.status === 'active' && diffDays >= 0) return next()
    if (diffDays < 0 && Math.abs(diffDays) <= graceDays) return next()

    return res.status(402).json({ error: 'Subscription expired', state: 'expired' })
  } catch (e) {
    next(e)
  }
}
