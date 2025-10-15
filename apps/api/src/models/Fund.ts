import { Schema, model } from 'mongoose'

export interface IFund {
  name: string
  restricted: boolean
  active: boolean
}

const fundSchema = new Schema<IFund>({
  name: { type: String, required: true, unique: true, index: true },
  restricted: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
})

export const Fund = model<IFund>('Fund', fundSchema)
