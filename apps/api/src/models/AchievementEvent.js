import mongoose from 'mongoose';

const { Schema } = mongoose;

const achievementEventSchema = new Schema(
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
    achievementKey: String,
    type: {
      type: String,
      enum: ['progress_updated', 'achievement_unlocked', 'achievement_seen'],
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model('AchievementEvent', achievementEventSchema);
