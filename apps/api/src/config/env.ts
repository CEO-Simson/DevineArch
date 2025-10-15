import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().url().or(z.string().startsWith('mongodb://')),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().optional(),
})

export const env = envSchema.parse(process.env)
