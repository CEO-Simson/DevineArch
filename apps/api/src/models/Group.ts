import { Schema, model, Types } from 'mongoose'

export interface IGroupMember {
  personId: Types.ObjectId
  role?: string
}

export interface IGroup {
  name: string
  type?: string
  members: IGroupMember[]
  createdAt: Date
  updatedAt: Date
}

const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, index: true },
    type: { type: String },
    members: [{ personId: { type: Schema.Types.ObjectId, ref: 'Person' }, role: String }],
  },
  { timestamps: true }
)

export const Group = model<IGroup>('Group', groupSchema)
