import mongoose from 'mongoose';

const { Schema } = mongoose;

const creatorTrustS = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalSubmitted: { type: Number, default: 0 },
  approvedCount: { type: Number, default: 0 },
  trustScore: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
});

export default mongoose.model('CreatorTrust', creatorTrustS);
