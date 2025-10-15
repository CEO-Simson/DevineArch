import { Schema, model, Types } from 'mongoose'

export interface IDonation {
  personId?: Types.ObjectId
  fundId: Types.ObjectId
  amount: number
  method: 'cash' | 'check' | 'card' | 'ach'
  date: Date
  txnRef?: string
  batchId?: Types.ObjectId
  depositId?: Types.ObjectId
}

const donationSchema = new Schema<IDonation>({
  personId: { type: Schema.Types.ObjectId, ref: 'Person', index: true },
  fundId: { type: Schema.Types.ObjectId, ref: 'Fund', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  method: { type: String, enum: ['cash', 'check', 'card', 'ach'], required: true },
  date: { type: Date, default: () => new Date(), index: true },
  txnRef: String,
  batchId: { type: Schema.Types.ObjectId, ref: 'Batch' },
  depositId: { type: Schema.Types.ObjectId, ref: 'Deposit' },
})

export const Donation = model<IDonation>('Donation', donationSchema)
