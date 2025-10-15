import { Schema, model, Types } from 'mongoose'

export interface IPerson {
  householdId?: Types.ObjectId
  firstName: string
  lastName: string
  email?: string
  phone?: string
  tags: string[]
  custom: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const personSchema = new Schema<IPerson>(
  {
    householdId: { type: Schema.Types.ObjectId, ref: 'Household', index: true },
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    email: { type: String, index: true },
    phone: { type: String },
    tags: { type: [String], default: [] },
    custom: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

personSchema.index({ lastName: 1, firstName: 1 })

export const Person = model<IPerson>('Person', personSchema)
