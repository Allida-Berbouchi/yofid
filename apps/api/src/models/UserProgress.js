import mongoose from 'mongoose';

const { Schema } = mongoose;

const userProgressS = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  progressPercent: { type: Number, default: 0 },
  lastPosition: { type: Number, default: 0 },
  completedAt: Date,
}, { timestamps: true });

userProgressS.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.model('UserProgress', userProgressS);
