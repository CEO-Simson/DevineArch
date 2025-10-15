import { Schema, model } from 'mongoose'

export interface IUser {
  email: string
  name: string
  passwordHash: string
  roles: string[]
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['member'] },
  },
  { timestamps: true }
)

export const User = model<IUser>('User', userSchema)
