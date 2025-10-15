import { Schema, model } from 'mongoose'

export interface IDeposit {
  date: Date
  bankRef?: string
  notes?: string
}

const depositSchema = new Schema<IDeposit>({
  date: { type: Date, required: true, index: true },
  bankRef: String,
  notes: String,
})

export const Deposit = model<IDeposit>('Deposit', depositSchema)
