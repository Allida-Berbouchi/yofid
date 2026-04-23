
import express from 'express';
import userController from '../controllers/User.js';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

// Registration & login

router.post('/register', userController.register);
router.post('/login', userController.login);

// Get current user info
router.get('/me', authMiddleware, userController.getMe);

// Request creator status (protected route)
router.post('/request-creator', authMiddleware, userController.requestCreatorStatus);

export default router;
