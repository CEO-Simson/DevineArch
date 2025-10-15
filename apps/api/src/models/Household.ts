import { Schema, model, Types } from 'mongoose'

export interface IHousehold {
  name: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postal?: string
    country?: string
  }
  createdAt: Date
  updatedAt: Date
}

const householdSchema = new Schema<IHousehold>(
  {
    name: { type: String, required: true, index: true },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postal: String,
      country: String,
    },
  },
  { timestamps: true }
)

export const Household = model<IHousehold>('Household', householdSchema)
