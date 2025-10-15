import { Schema, model, Types } from 'mongoose'

export interface IStatement {
  year: number
  personId?: Types.ObjectId
  householdId?: Types.ObjectId
  deliveredAt?: Date
}

const statementSchema = new Schema<IStatement>({
  year: { type: Number, required: true, index: true },
  personId: { type: Schema.Types.ObjectId, ref: 'Person' },
  householdId: { type: Schema.Types.ObjectId, ref: 'Household' },
  deliveredAt: Date,
})

export const Statement = model<IStatement>('Statement', statementSchema)
