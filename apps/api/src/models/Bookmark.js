import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookmarkSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
  savedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bookmark', bookmarkSchema);
