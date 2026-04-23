import express from 'express';
import reviewController from '../controllers/review.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/helpful', authMiddleware, reviewController.markHelpful);

export default router;
