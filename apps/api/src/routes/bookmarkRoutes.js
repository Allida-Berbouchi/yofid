import express from 'express';
import bookmarkController from '../controllers/bookmark.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/save', authMiddleware, bookmarkController.saveForLater);

export default router;
