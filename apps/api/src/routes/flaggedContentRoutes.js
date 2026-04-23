import express from 'express';
import flaggedController from '../controllers/flaggedContent.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/report', authMiddleware, flaggedController.reportContent);
router.post('/resolve', authMiddleware, flaggedController.resolveReport);

export default router;
