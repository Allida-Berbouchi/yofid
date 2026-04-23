import mongoose from 'mongoose';

const { Schema } = mongoose;

const schoolS = new Schema({
  name: { type: String, required: true },
  verified: { type: Boolean, default: false },
  subscriptionTier: { type: String, enum: ['basic', 'premium', 'enterprise'], default: 'basic' },
  maxCreators: { type: Number, default: 0 },
});

export default mongoose.model('School', schoolS);
