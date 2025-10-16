import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { Fund } from '../models/Fund.js'
import { Pledge } from '../models/Pledge.js'
import { Donation } from '../models/Donation.js'
import { Batch } from '../models/Batch.js'
import { Deposit } from '../models/Deposit.js'

const r = Router()
r.use(requireAuth)

// Funds
const fundSchema = z.object({ name: z.string().min(1), restricted: z.boolean().optional(), active: z.boolean().optional() })

r.get('/funds', async (_req, res) => {
  const items = await Fund.find().lean()
  res.json({ items })
})

r.post('/funds', async (req, res) => {
  const data = fundSchema.parse(req.body)
  const item = await Fund.create(data)
  res.status(201).json(item)
})

r.put('/funds/:id', async (req, res) => {
  const data = fundSchema.parse(req.body)
  const item = await Fund.findByIdAndUpdate(req.params.id, data, { new: true })
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

r.delete('/funds/:id', async (req, res) => {
  await Fund.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

// Pledges
const pledgeSchema = z.object({
  personId: z.string(),
  fundId: z.string(),
  amount: z.number().positive(),
  frequency: z.enum(['one-time', 'weekly', 'monthly', 'quarterly', 'yearly']).default('monthly'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

r.get('/pledges', async (req, res) => {
  const personId = req.query.personId as string | undefined
  const where: any = {}
  if (personId) where.personId = personId
  const items = await Pledge.find(where).lean()
  res.json({ items })
})

r.post('/pledges', async (req, res) => {
  const data = pledgeSchema.parse(req.body)
  const item = await Pledge.create(data)
  res.status(201).json(item)
})

// Donations
const donationSchema = z.object({
  personId: z.string().optional(),
  fundId: z.string(),
  amount: z.number().positive(),
  method: z.enum(['cash', 'check', 'card', 'ach']),
  date: z.coerce.date().optional(),
  txnRef: z.string().optional(),
  batchId: z.string().optional(),
  depositId: z.string().optional(),
})

r.get('/donations', async (req, res) => {
  const fundId = req.query.fundId as string | undefined
  const where: any = {}
  if (fundId) where.fundId = fundId
  const items = await Donation.find(where).sort({ date: -1 }).limit(500).lean()
  res.json({ items })
})

r.post('/donations', async (req, res) => {
  const data = donationSchema.parse(req.body)
  const item = await Donation.create(data)
  res.status(201).json(item)
})

r.put('/donations/:id', async (req, res) => {
  const data = donationSchema.parse(req.body)
  const item = await Donation.findByIdAndUpdate(req.params.id, data, { new: true })
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

r.delete('/donations/:id', async (req, res) => {
  await Donation.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

// Batches
const batchSchema = z.object({ date: z.coerce.date(), notes: z.string().optional() })

r.get('/batches', async (_req, res) => {
  const items = await Batch.find().sort({ date: -1 }).lean()
  res.json({ items })
})

r.post('/batches', async (req, res) => {
  const data = batchSchema.parse(req.body)
  const item = await Batch.create({ ...data })
  res.status(201).json(item)
})

// Deposits
const depositSchema = z.object({ date: z.coerce.date(), bankRef: z.string().optional(), notes: z.string().optional() })

r.get('/deposits', async (_req, res) => {
  const items = await Deposit.find().sort({ date: -1 }).lean()
  res.json({ items })
})

r.post('/deposits', async (req, res) => {
  const data = depositSchema.parse(req.body)
  const item = await Deposit.create(data)
  res.status(201).json(item)
})

export default r
