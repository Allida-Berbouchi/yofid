import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  helpfulCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
