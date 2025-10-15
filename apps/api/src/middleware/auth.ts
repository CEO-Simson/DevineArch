import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface AuthedRequest extends Request {
  user?: { id: string; roles: string[] }
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; roles: string[] }
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
