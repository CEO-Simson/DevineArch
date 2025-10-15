import { Schema, model, Types } from 'mongoose'

export interface IPledge {
  personId: Types.ObjectId
  fundId: Types.ObjectId
  amount: number
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate?: Date
  endDate?: Date
}

const pledgeSchema = new Schema<IPledge>({
  personId: { type: Schema.Types.ObjectId, ref: 'Person', required: true, index: true },
  fundId: { type: Schema.Types.ObjectId, ref: 'Fund', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  frequency: {
    type: String,
    enum: ['one-time', 'weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly',
  },
  startDate: Date,
  endDate: Date,
})

export const Pledge = model<IPledge>('Pledge', pledgeSchema)
