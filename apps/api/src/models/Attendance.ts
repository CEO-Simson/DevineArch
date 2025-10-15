import { Schema, model, Types } from 'mongoose'

export interface IAttendance {
  personId: Types.ObjectId
  groupId?: Types.ObjectId
  eventId?: Types.ObjectId | string
  occurredAt: Date
  notes?: string
}

const attendanceSchema = new Schema<IAttendance>({
  personId: { type: Schema.Types.ObjectId, ref: 'Person', required: true, index: true },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
  eventId: { type: Schema.Types.Mixed },
  occurredAt: { type: Date, default: () => new Date(), index: true },
  notes: String,
})

export const Attendance = model<IAttendance>('Attendance', attendanceSchema)
