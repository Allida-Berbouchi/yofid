import express from 'express';
import cors from 'cors';
import path from 'path';
import { connect } from 'mongoose';

import './loadEnv.js';
import userRoutes from './routes/userRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import flaggedRoutes from './routes/flaggedContentRoutes.js';
import { uploadRoot } from './controllers/upload.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(uploadRoot)));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/flags', flaggedRoutes);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not set');
} else {
  connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err.message));
}

export default app;
