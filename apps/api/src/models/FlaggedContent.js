import mongoose from 'mongoose';

const { Schema } = mongoose;

const flaggedContentSchema = new Schema({
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: String,
  reportStatus: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
});

export default mongoose.model('FlaggedContent', flaggedContentSchema);
