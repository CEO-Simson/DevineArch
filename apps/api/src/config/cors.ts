import cors, { CorsOptions } from 'cors'

export function buildCors() {
  const origins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)
  const allowAll = origins.length === 0
  const options: CorsOptions = allowAll
    ? { origin: true, credentials: true }
    : {
        origin: (origin, cb) => {
          if (!origin) return cb(null, true)
          if (origins.includes(origin)) return cb(null, true)
          cb(new Error('Not allowed by CORS'))
        },
        credentials: true,
      }
  return cors(options)
}
