import mongoose from 'mongoose';

const { Schema } = mongoose;

const auditLogSchema = new Schema({
  action: { type: String, required: true },
  target: String,
  targetId: Schema.Types.ObjectId,
  oldValues: Schema.Types.Mixed,
  newValues: Schema.Types.Mixed,
  ipAddress: String,
  createdAt: { type: Date, default: Date.now },
  actorId: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('AuditLog', auditLogSchema);
