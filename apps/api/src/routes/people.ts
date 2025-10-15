import { Router } from 'express'
import { z } from 'zod'
import { Household } from '../models/Household'
import { Person } from '../models/Person'
import { Group } from '../models/Group'
import { Attendance } from '../models/Attendance'
import { requireAuth } from '../middleware/auth'

const r = Router()
r.use(requireAuth)

// Households
const householdSchema = z.object({
  name: z.string().min(1),
  address: z
    .object({ line1: z.string().optional(), line2: z.string().optional(), city: z.string().optional(), state: z.string().optional(), postal: z.string().optional(), country: z.string().optional() })
    .optional(),
})

r.get('/households', async (req, res) => {
  const q = String((req.query.q as string) || '')
  const where = q ? { name: { $regex: q, $options: 'i' } } : {}
  const households = await Household.find(where).lean()
  res.json({ items: households })
})

r.post('/households', async (req, res) => {
  const data = householdSchema.parse(req.body)
  const hh = await Household.create(data)
  res.status(201).json(hh)
})

r.put('/households/:id', async (req, res) => {
  const data = householdSchema.parse(req.body)
  const hh = await Household.findByIdAndUpdate(req.params.id, data, { new: true })
  if (!hh) return res.status(404).json({ error: 'Not found' })
  res.json(hh)
})

r.delete('/households/:id', async (req, res) => {
  await Household.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

// Persons
const personSchema = z.object({
  householdId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  custom: z.record(z.any()).optional(),
})

r.get('/persons', async (req, res) => {
  const q = String((req.query.q as string) || '')
  const where = q
    ? { $or: [{ firstName: { $regex: q, $options: 'i' } }, { lastName: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }] }
    : {}
  const people = await Person.find(where).limit(200).lean()
  res.json({ items: people })
})

r.post('/persons', async (req, res) => {
  const data = personSchema.parse(req.body)
  const p = await Person.create(data)
  res.status(201).json(p)
})

r.put('/persons/:id', async (req, res) => {
  const data = personSchema.parse(req.body)
  const p = await Person.findByIdAndUpdate(req.params.id, data, { new: true })
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

r.delete('/persons/:id', async (req, res) => {
  await Person.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

// Groups
const groupSchema = z.object({ name: z.string().min(1), type: z.string().optional() })

r.get('/groups', async (_req, res) => {
  const groups = await Group.find().lean()
  res.json({ items: groups })
})

r.post('/groups', async (req, res) => {
  const data = groupSchema.parse(req.body)
  const g = await Group.create({ ...data, members: [] })
  res.status(201).json(g)
})

r.post('/groups/:id/members', async (req, res) => {
  const data = z.object({ personId: z.string(), role: z.string().optional() }).parse(req.body)
  const g = await Group.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { members: { personId: data.personId, role: data.role } } },
    { new: true }
  )
  if (!g) return res.status(404).json({ error: 'Not found' })
  res.json(g)
})

r.delete('/groups/:id/members/:personId', async (req, res) => {
  const g = await Group.findByIdAndUpdate(
    req.params.id,
    { $pull: { members: { personId: req.params.personId } } },
    { new: true }
  )
  if (!g) return res.status(404).json({ error: 'Not found' })
  res.json(g)
})

// Attendance
const attendanceSchema = z.object({
  personId: z.string(),
  groupId: z.string().optional(),
  eventId: z.union([z.string(), z.number()]).optional(),
  occurredAt: z.coerce.date().optional(),
  notes: z.string().optional(),
})

r.get('/attendance', async (req, res) => {
  const groupId = req.query.groupId as string | undefined
  const personId = req.query.personId as string | undefined
  const where: any = {}
  if (groupId) where.groupId = groupId
  if (personId) where.personId = personId
  const items = await Attendance.find(where).sort({ occurredAt: -1 }).limit(500).lean()
  res.json({ items })
})

r.post('/attendance', async (req, res) => {
  const data = attendanceSchema.parse(req.body)
  const item = await Attendance.create(data)
  res.status(201).json(item)
})

export default r
