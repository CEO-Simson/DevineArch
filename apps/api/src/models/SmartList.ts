import { Schema, model } from 'mongoose'

export interface ISmartListCriteria {
  q?: string
  tagsAny?: string[]
  tagsAll?: string[]
  tagsNone?: string[]
}

export interface ISmartList {
  name: string
  criteria: ISmartListCriteria
  createdAt: Date
  updatedAt: Date
}

const smartListSchema = new Schema<ISmartList>(
  {
    name: { type: String, required: true },
    criteria: {
      q: String,
      tagsAny: [String],
      tagsAll: [String],
      tagsNone: [String],
    },
  },
  { timestamps: true }
)

export const SmartList = model<ISmartList>('SmartList', smartListSchema)
