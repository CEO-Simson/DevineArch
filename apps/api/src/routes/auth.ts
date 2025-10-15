import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { env } from '../config/env'

const router = Router()

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
    const user = await User.create({ email, name, passwordHash, roles: ['member'] })
    const token = jwt.sign({ id: user.id, roles: user.roles }, env.JWT_SECRET, { expiresIn: '7d' })
    return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, roles: user.roles } })
  } catch (err) {
    next(err)
  }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, roles: user.roles }, env.JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, roles: user.roles } })
  } catch (err) {
    next(err)
  }
})

export default router
