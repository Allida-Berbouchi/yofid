import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/jwt.js';

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    const isExpired = err?.name === 'TokenExpiredError';
    return res.status(401).json({
      message: isExpired ? 'Token expired' : 'Invalid token',
    });
  }
}
