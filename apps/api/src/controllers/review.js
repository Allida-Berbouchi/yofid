import mongoose from 'mongoose';

import Comment from '../models/Comment.js';
import Content from '../models/Content.js';
import Review from '../models/Review.js';
import { addContentSignals, recalculateContentEngagement } from '../services/contentScoring.js';

const getUserId = (req) =>
  req.user?._id?.toString() ||
  req.user?.id ||
  req.account?._id?.toString() ||
  req.account?.id;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(String(id || ''));

function normalizeRating(value) {
  const rating = Number(value);

  if (!Number.isFinite(rating)) return null;

  // Backward compatibility for the old -1 / 0 / 1 review API.
  if (rating === -1) return 1;
  if (rating === 0) return 3;
  if (rating === 1) return 5;

  if (rating < 1 || rating > 5) return null;
  return Math.round(rating);
}

async function recalculateAverageRating(contentId) {
  const [stats] = await Review.aggregate([
    { $match: { contentId: new mongoose.Types.ObjectId(contentId) } },
    {
      $group: {
        _id: '$contentId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats?.averageRating ? Number(stats.averageRating.toFixed(2)) : 0;
  const reviewCount = Number(stats?.reviewCount || 0);

  const content = await Content.findByIdAndUpdate(
    contentId,
    { $set: { averageRating } },
    { new: true }
  );

  await recalculateContentEngagement(contentId);

  return { content, averageRating, reviewCount };
}

function serializeComment(comment) {
  const user = comment.userId || {};
  const name = typeof user === 'object' ? user.name || user.email || 'Learner' : 'Learner';

  return {
    id: comment._id,
    _id: comment._id,
    userId: typeof user === 'object' ? user._id : user,
    user: name,
    username: String(name)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, ''),
    role: typeof user === 'object' ? user.role || 'Student' : 'Student',
    text: comment.content,
    content: comment.content,
    createdAt: comment.createdAt,
  };
}

const getContentReviews = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { contentId } = req.params;

    if (!isValidObjectId(contentId)) {
      return res.status(400).json({ message: 'Invalid contentId' });
    }

    const content = await Content.findById(contentId).lean();

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const [reviewCount, comments, userReview] = await Promise.all([
      Review.countDocuments({ contentId }),
      Comment.find({ contentId })
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      userId && isValidObjectId(userId) ? Review.findOne({ contentId, userId }).lean() : null,
    ]);

    return res.json({
      contentId,
      averageRating: Number(content.averageRating || 0),
      reviewCount,
      userReview,
      comments: comments.map(serializeComment),
      commentCount: content.interactionCounts?.comments || comments.length,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to load comments and reviews',
      error: err.message,
    });
  }
};

const addReview = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { contentId, rating, value } = req.body;
    const normalizedRating = normalizeRating(rating ?? value);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!isValidObjectId(contentId) || !normalizedRating) {
      return res.status(400).json({ message: 'Invalid contentId or rating' });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const review = await Review.findOneAndUpdate(
      { contentId, userId },
      { $set: { rating: normalizedRating } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const stats = await recalculateAverageRating(contentId);

    return res.status(201).json({
      message: 'Review saved',
      review,
      averageRating: stats.averageRating,
      reviewCount: stats.reviewCount,
      updatedContent: stats.content,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to save review',
      error: err.message,
    });
  }
};

const handleComment = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { contentId, comment, commentT, text } = req.body;
    const cleanComment = String(comment ?? commentT ?? text ?? '').trim();

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!isValidObjectId(contentId) || !cleanComment) {
      return res.status(400).json({ message: 'Invalid contentId or comment' });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const newComment = await Comment.create({
      contentId,
      content: cleanComment,
      userId,
    });

    const populatedComment = await Comment.findById(newComment._id)
      .populate('userId', 'name email role')
      .lean();

    const updatedContent = await addContentSignals(contentId, { comments: 1 });

    return res.status(201).json({
      message: 'Comment saved',
      comment: serializeComment(populatedComment),
      updatedContent,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to save comment',
      error: error.message,
    });
  }
};

const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.body;

    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({ message: 'Invalid reviewId' });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.json({
      message: 'Review marked as helpful',
      review,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to mark review as helpful',
      error: err.message,
    });
  }
};

export default { getContentReviews, addReview, handleComment, markHelpful };
