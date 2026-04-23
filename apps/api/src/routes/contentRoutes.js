import express from 'express';
import contentController from '../controllers/content.js';
import authMiddleware from '../middleware/auth.js';
import { requireCreatorOrAdmin } from '../middleware/resourceAccess.js';
import upload from "../controllers/upload.js"; // Ensure this path is correct

const router = express.Router();

// List all content (Public)
router.get('/', contentController.listAllContent);
router.get('/top', contentController.listTopContent);
router.get('/mine', authMiddleware, requireCreatorOrAdmin, contentController.listMyContent);

// Create content (Authenticated + File Upload)
// We use upload.array('files', 20) to handle multiple file uploads
router.post('/', authMiddleware, requireCreatorOrAdmin, upload.array("files", 20), contentController.createContent);

// Other Actions
router.post('/interactions', authMiddleware, contentController.handleContentInteraction);
router.post('/submit', authMiddleware, contentController.submitForApproval);
router.delete('/:id', authMiddleware, requireCreatorOrAdmin, contentController.deleteContent);
router.get('/:id', contentController.getContent);
router.post('/review', authMiddleware, contentController.addReview);

export default router;
