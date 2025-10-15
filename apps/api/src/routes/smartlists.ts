import { Router } from 'express'
import { z } from 'zod'
import { SmartList } from '../models/SmartList'
import { Person } from '../models/Person'
import { requireAuth } from '../middleware/auth'

const r = Router()
r.use(requireAuth)

const criteriaSchema = z.object({
  q: z.string().optional(),
  tagsAny: z.array(z.string()).optional(),
  tagsAll: z.array(z.string()).optional(),
  tagsNone: z.array(z.string()).optional(),
})

const smartListSchema = z.object({ name: z.string().min(1), criteria: criteriaSchema })

r.get('/', async (_req, res) => {
  const items = await SmartList.find().sort({ updatedAt: -1 }).lean()
  res.json({ items })
})

r.post('/', async (req, res, next) => {
  try {
    const data = smartListSchema.parse(req.body)
    const item = await SmartList.create(data)
    res.status(201).json(item)
  } catch (e) {
    next(e)
  }
})

function buildQuery(c: z.infer<typeof criteriaSchema>) {
  const where: any = {}
  if (c.q) where.$or = [
    { firstName: { $regex: c.q, $options: 'i' } },
    { lastName: { $regex: c.q, $options: 'i' } },
    { email: { $regex: c.q, $options: 'i' } },
  ]
  if (c.tagsAny?.length) where.tags = { ...(where.tags || {}), $in: c.tagsAny }
  if (c.tagsAll?.length) where.tags = { ...(where.tags || {}), $all: c.tagsAll }
  if (c.tagsNone?.length) where.tags = { ...(where.tags || {}), $nin: c.tagsNone }
  return where
}

r.get('/:id/preview', async (req, res) => {
  const item = await SmartList.findById(req.params.id).lean()
  if (!item) return res.status(404).json({ error: 'Not found' })
  const where = buildQuery(item.criteria || {})
  const limit = Number(req.query.limit || 100)
  const people = await Person.find(where).limit(limit).lean()
  res.json({ items: people })
})

export default r
