import express from 'express'
import pinoHttp from 'pino-http'
import createError from 'http-errors'
import authRoutes from './routes/auth.js'
import peopleRoutes from './routes/people.js'
import givingRoutes from './routes/giving.js'
import smartlistsRoutes from './routes/smartlists.js'
import reportsRoutes from './routes/reports.js'
import { organizationsRouter } from './routes/organizations.js'
import { subscriptionsRouter } from './routes/subscriptions.js'
import { invitesRouter } from './routes/invites.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { buildCors } from './config/cors.js'
import { logger } from './config/log.js'
import { razorpayPaymentsRouter } from './routes/payments.razorpay'

const app = express()

app.use(express.json())
app.use(helmet())
app.use(buildCors())
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    limit: Number(process.env.RATE_LIMIT_MAX || 300),
    standardHeaders: true,
    legacyHeaders: false,
  })
)
app.use(pinoHttp({ logger }))

app.get('/healthz', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/payments/razorpay', express.json({ type: '*/*' }), razorpayPaymentsRouter)
app.use('/api/payments/razorpay', express.json({ type: '*/*' }), razorpayPaymentsRouter)
app.use('/api/organizations', organizationsRouter)
app.use('/api/subscriptions', subscriptionsRouter)
app.use('/api/invites', invitesRouter)
app.use('/api/people', peopleRoutes)
app.use('/api/giving', givingRoutes)
app.use('/api/smartlists', smartlistsRoutes)
app.use('/api/reports', reportsRoutes)

app.use((_req, _res, next) => next(createError(404)))
app.use((err: any, _req: any, res: any, _next: any) => {
  if (err.name === 'ZodError') return res.status(400).json({ error: 'Invalid input', details: err.issues })
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal Server Error' })
})

export default app
