import mongoose from 'mongoose';

const { Schema } = mongoose;

const userProgressS = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    lastPosition: { type: Number, default: 0, min: 0 },
    durationSeconds: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
    firstViewedAt: Date,
    lastViewedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

userProgressS.index({ userId: 1, contentId: 1 }, { unique: true });
userProgressS.index({ contentId: 1, status: 1 });
userProgressS.index({ userId: 1, updatedAt: -1 });

export default mongoose.model('UserProgress', userProgressS);
