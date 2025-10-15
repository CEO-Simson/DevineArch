import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import createError from 'http-errors'
import authRoutes from './routes/auth'
import { env } from './config/env'
import helmet from 'helmet'

const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN || true }))
app.use(morgan('dev'))

app.get('/healthz', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)

app.use((_req, _res, next) => next(createError(404)))
app.use((err: any, _req: any, res: any, _next: any) => {
  if (err.name === 'ZodError') return res.status(400).json({ error: 'Invalid input', details: err.issues })
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal Server Error' })
})

export default app
