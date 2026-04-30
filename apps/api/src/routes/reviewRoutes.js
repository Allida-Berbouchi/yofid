import express from 'express';

import reviewController from '../controllers/review.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/:contentId', authMiddleware, reviewController.getContentReviews);
router.post('/', authMiddleware, reviewController.addReview);
router.post('/comments', authMiddleware, reviewController.handleComment);
router.post('/helpful', authMiddleware, reviewController.markHelpful);

export default router;
