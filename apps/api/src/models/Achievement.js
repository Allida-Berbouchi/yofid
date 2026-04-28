import mongoose from 'mongoose';

const { Schema } = mongoose;

const achievementSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'onboarding',
        'streak',
        'completion',
        'mastery',
        'focus',
        'exploration',
        'review',
        'community',
        'creator',
        'special',
      ],
      required: true,
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary', 'mythic'],
      default: 'common',
    },
    iconType: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: '#d4af37',
    },
    xp: {
      type: Number,
      default: 10,
      min: 0,
    },
    criteria: {
      metric: {
        type: String,
        required: true,
      },
      operator: {
        type: String,
        enum: ['gte', 'eq'],
        default: 'gte',
      },
      target: {
        type: Number,
        required: true,
      },
      contentType: String,
      courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ 'criteria.metric': 1 });

export default mongoose.model('Achievement', achievementSchema);
