import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';
import { jwtSecret } from '../utils/jwt.js';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role ,level : user.level.toString() },
      jwtSecret,
      { expiresIn: '1d' },
    );

    // Return the full user object (excluding passwordHash)
    const userObj = user.toObject();
    delete userObj.passwordHash;
    return res.json({ token, user: userObj });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const requestCreatorStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.creator = true;
    await user.save();

    return res.json({ message: 'Creator status requested', userId: user._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// Get current user info
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user progress for all content
const getProgress = async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user.id });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  register,
  login,
  requestCreatorStatus,
  getMe,
  getProgress,
};
