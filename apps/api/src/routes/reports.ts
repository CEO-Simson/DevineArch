import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { Donation } from '../models/Donation'
import { Fund } from '../models/Fund'
import { Attendance } from '../models/Attendance'
import { Person } from '../models/Person'
import { Household } from '../models/Household'

const r = Router()
r.use(requireAuth)

// Giving summary by fund
r.get('/giving/summary', async (req, res, next) => {
  try {
    const params = z
      .object({ from: z.coerce.date().optional(), to: z.coerce.date().optional() })
      .parse({ from: req.query.from, to: req.query.to })
    const match: any = {}
    if (params.from) match.date = { ...(match.date || {}), $gte: params.from }
    if (params.to) match.date = { ...(match.date || {}), $lte: params.to }

    const rows = await Donation.aggregate([
      { $match: match },
      { $group: { _id: '$fundId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'funds', localField: '_id', foreignField: '_id', as: 'fund' } },
      { $unwind: { path: '$fund', preserveNullAndEmptyArrays: true } },
      { $project: { fundId: '$_id', _id: 0, total: 1, count: 1, fundName: '$fund.name' } },
      { $sort: { total: -1 } },
    ])
    const grandTotal = rows.reduce((a, b) => a + (b.total || 0), 0)
    res.json({ items: rows, grandTotal })
  } catch (e) {
    next(e)
  }
})

// Attendance summary by group
r.get('/attendance/summary', async (req, res, next) => {
  try {
    const params = z
      .object({ from: z.coerce.date().optional(), to: z.coerce.date().optional(), groupId: z.string().optional() })
      .parse({ from: req.query.from, to: req.query.to, groupId: req.query.groupId })
    const match: any = {}
    if (params.from) match.occurredAt = { ...(match.occurredAt || {}), $gte: params.from }
    if (params.to) match.occurredAt = { ...(match.occurredAt || {}), $lte: params.to }
    if (params.groupId) match.groupId = params.groupId

    const rows = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: '$groupId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    res.json({ items: rows })
  } catch (e) {
    next(e)
  }
})

// People/Households counts
r.get('/people/summary', async (_req, res, next) => {
  try {
    const [personsCount, householdsCount] = await Promise.all([Person.countDocuments({}), Household.countDocuments({})])
    res.json({ personsCount, householdsCount })
  } catch (e) {
    next(e)
  }
})

export default r
