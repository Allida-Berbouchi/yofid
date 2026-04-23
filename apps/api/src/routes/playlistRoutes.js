import express from 'express';
import playlistController from '../controllers/playlist.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, playlistController.createPlaylist);
router.post('/add', authMiddleware, playlistController.addContent);

export default router;
