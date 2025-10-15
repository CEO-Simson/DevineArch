import { Schema, model, Types } from 'mongoose'

export interface IBatch {
  date: Date
  enteredBy?: Types.ObjectId
  notes?: string
}

const batchSchema = new Schema<IBatch>({
  date: { type: Date, required: true, index: true },
  enteredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: String,
})

export const Batch = model<IBatch>('Batch', batchSchema)
