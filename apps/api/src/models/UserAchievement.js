import mongoose from 'mongoose';

const { Schema } = mongoose;

const userAchievementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    achievementId: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },
    achievementKey: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['locked', 'in_progress', 'unlocked'],
      default: 'locked',
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    target: {
      type: Number,
      required: true,
    },
    unlockedAt: Date,
    seenAt: Date,
    source: {
      type: String,
      enum: [
        'progress',
        'course',
        'content',
        'review',
        'bookmark',
        'community',
        'system',
      ],
      default: 'system',
    },
  },
  { timestamps: true }
);

userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export default mongoose.model('UserAchievement', userAchievementSchema);
