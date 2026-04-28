import express from 'express';

import authMiddleware from '../middleware/auth.js';
import {
  evaluateMyAchievements,
  getMyAchievements,
  markAchievementSeen,
} from '../controllers/achievementController.js';

const router = express.Router();

router.get('/me', authMiddleware, getMyAchievements);
router.post('/evaluate', authMiddleware, evaluateMyAchievements);
router.patch('/:id/seen', authMiddleware, markAchievementSeen);

export default router;
