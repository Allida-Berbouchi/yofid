import mongoose from 'mongoose';

const { Schema } = mongoose;

const playlistSchema = new Schema({
  title: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contentIds: [{ type: Schema.Types.ObjectId, ref: 'Content' }],
  isPublic: { type: Boolean, default: true },
});

export default mongoose.model('Playlist', playlistSchema);
