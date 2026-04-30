import express from 'express';
import contentController from '../controllers/content.js';
import authMiddleware from '../middleware/auth.js';
import { requireCreatorOrAdmin } from '../middleware/resourceAccess.js';
import upload from '../controllers/upload.js';

const router = express.Router();

router.get('/', contentController.listAllContent);
router.get('/top', contentController.listTopContent);
router.get('/mine', authMiddleware, requireCreatorOrAdmin, contentController.listMyContent);

router.post('/', authMiddleware, requireCreatorOrAdmin, upload.array('files', 20), contentController.createContent);
router.post('/interactions', authMiddleware, contentController.handleContentInteraction);
router.post('/submit', authMiddleware, contentController.submitForApproval);

router.get('/:id/progress', authMiddleware, contentController.getContentProgress);
router.patch('/:id/progress', authMiddleware, contentController.saveContentProgress);
router.post('/:id/progress', authMiddleware, contentController.saveContentProgress);

router.delete('/:id', authMiddleware, requireCreatorOrAdmin, contentController.deleteContent);
router.get('/:id', contentController.getContent);

export default router;
