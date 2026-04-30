import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    helpfulCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ contentId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
