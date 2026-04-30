import fs from 'fs';

import Content from '../models/Content.js';
import Review from '../models/Review.js';
import Comment from '../models/Comment.js';
import Course from '../models/Course.js';
import Bookmark from '../models/Bookmark.js';
import UserProgress from '../models/UserProgress.js';
import {
  recordContentInteraction,
  recordLearningProgress,
} from '../services/learningProgress.js';

const allowedTypes = ['video', 'image', 'pdf', 'link', 'text', 'article'];

const getUserId = (req) =>
  req.user?._id?.toString() ||
  req.user?.id ||
  req.account?._id?.toString() ||
  req.account?.id;

const getUserRole = (req) => req.user?.role || req.account?.role || 'user';

export const isValidObjectId = (id) =>
  Boolean(id && String(id).match(/^[0-9a-fA-F]{24}$/));

const getTypeFromMime = (mime = '') => {
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('image/')) return 'image';
  if (mime === 'application/pdf') return 'pdf';
  return null;
};

const normalizeSelectedType = (selectedType) => {
  if (!selectedType) return null;

  const value = String(selectedType).toLowerCase();
  return allowedTypes.includes(value) ? value : null;
};

const getTypeFromUrl = (value, selectedType) => {
  const normalizedType = normalizeSelectedType(selectedType);

  if (normalizedType) return normalizedType;

  const url = String(value || '').toLowerCase();

  if (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com') ||
    url.endsWith('.mp4') ||
    url.endsWith('.mov') ||
    url.endsWith('.webm')
  ) {
    return 'video';
  }

  if (url.endsWith('.pdf')) return 'pdf';
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)) return 'image';

  return 'link';
};

const parseUrlItems = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const serializeContent = (content) =>
  content?.toObject ? content.toObject() : content;

const enrichContentItem = async (content) => {
  const item = serializeContent(content);

  if (!item?._id) {
    return item;
  }

  const learnerCount = await UserProgress.countDocuments({ contentId: item._id });
  const completionCount = await UserProgress.countDocuments({
    contentId: item._id,
    status: 'completed',
  });

  return {
    ...item,
    learnerCount,
    completionCount,
    completionRate: learnerCount ? completionCount / learnerCount : 0,
  };
};

const createContent = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, description, category, subject, gradeLevel, courseId } = req.body;
    const urlItems = parseUrlItems(req.body.urlItems);
    const files = req.files || [];

    if (files.length === 0 && urlItems.length === 0) {
      return res.status(400).json({
        message: 'Please upload at least one file or add at least one URL',
      });
    }

    if (courseId) {
      if (!isValidObjectId(courseId)) {
        return res.status(400).json({ message: 'Invalid courseId' });
      }

      const courseQuery =
        getUserRole(req) === 'admin'
          ? { _id: courseId }
          : { _id: courseId, createdBy: userId };

      const course = await Course.findOne(courseQuery);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    const docsToCreate = [];

    for (const file of files) {
      const type = getTypeFromMime(file.mimetype);
      if (!type) continue;

      docsToCreate.push({
        title: title || file.originalname,
        description: description || '',
        category: category || '',
        subject: subject || '',
        gradeLevel: gradeLevel || '',
        type,
        sourceKind: 'file',
        url: `/uploads/${file.filename}`,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageType: 'local',
        localPath: file.path,
        courseId: courseId || null,
        createdBy: userId,
      });
    }

    for (const item of urlItems) {
      if (!item?.url) continue;

      docsToCreate.push({
        title: item.title || title || 'Untitled URL Content',
        description: item.description || description || '',
        category: item.category || category || '',
        subject: subject || '',
        gradeLevel: gradeLevel || '',
        type: getTypeFromUrl(item.url, item.type),
        sourceKind: 'url',
        url: item.url,
        storageType: 'external',
        courseId: courseId || null,
        createdBy: userId,
      });
    }

    if (docsToCreate.length === 0) {
      return res.status(400).json({
        message: 'No valid content files or URLs were provided',
      });
    }

    const created = await Content.insertMany(docsToCreate, {
      ordered: true,
      runValidators: true,
    });

    return res.status(201).json({
      message: 'Content created successfully',
      items: created,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to create content',
      error: error.message,
    });
  }
};

const listAllContent = async (req, res) => {
  try {
    const limit = Math.max(0, Math.min(100, Number(req.query.limit || 20)));
    const status = req.query.status;
    const filter = status && status !== 'all' ? { status } : {};

    let query = Content.find(filter)
      .populate('createdBy', 'name email role')
      .populate('courseId', 'title description')
      .sort({ engagementScore: -1, totalViews: -1, createdAt: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const content = await query;
    return res.json(content);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch content',
      error: err.message,
    });
  }
};

const listTopContent = async (_req, res) => {
  try {
    const allApprovedContent = await Content.find({ status: 'approved' }).sort({
      engagementScore: -1,
      totalViews: -1,
      createdAt: -1,
    });

    const content = allApprovedContent.slice(0, 10);
    const categories = Array.from(
      new Set(allApprovedContent.map((item) => item.category).filter(Boolean))
    );

    const totalViews = allApprovedContent.reduce(
      (sum, item) => sum + Number(item.totalViews || 0),
      0
    );

    const avgScore = allApprovedContent.length
      ? allApprovedContent.reduce(
          (sum, item) => sum + Number(item.engagementScore || 0),
          0
        ) / allApprovedContent.length
      : 0;

    const topContent = await Promise.all(content.map(enrichContentItem));

    return res.json({
      summary: {
        totalContent: await Content.countDocuments(),
        approvedContent: allApprovedContent.length,
        totalViews,
        avgScore,
        activeCategories: categories.length,
      },
      categories,
      topContent,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch top content',
      error: err.message,
    });
  }
};

const listMyContent = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = getUserRole(req) === 'admin' ? {} : { createdBy: userId };

    const content = await Content.find(query)
      .populate('courseId', 'title description')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.json(content);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch your content',
      error: err.message,
    });
  }
};

const submitForApproval = async (req, res) => {
  try {
    const { contentId } = req.body;

    if (!isValidObjectId(contentId)) {
      return res.status(400).json({ message: 'Invalid contentId' });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    content.status = 'pending';
    await content.save();

    return res.json({
      message: 'Content submitted for approval',
      content,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to submit content',
      error: err.message,
    });
  }
};

const getContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid content id' });
    }

    const content = await Content.findById(id)
      .populate('createdBy', 'name email role')
      .populate('courseId', 'title description');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    return res.json(content);
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch content',
      error: err.message,
    });
  }
};

const getContentProgress = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid content id' });
    }

    const progress = await UserProgress.findOne({ userId, contentId: id }).lean();

    return res.json(
      progress || {
        userId,
        contentId: id,
        status: 'not_started',
        progressPercent: 0,
        lastPosition: 0,
        durationSeconds: 0,
        viewCount: 0,
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch progress',
      error: error.message,
    });
  }
};

const saveContentProgress = async (req, res) => {
  try {
    const contentId = req.params.id;

    if (!isValidObjectId(contentId)) {
      return res.status(400).json({ message: 'Invalid content id' });
    }

    const result = await recordLearningProgress({
      userId: getUserId(req),
      contentId,
      interactionType: req.body.interactionType || 'progress',
      progressPercent: req.body.progressPercent,
      lastPosition: req.body.lastPosition,
      durationSeconds: req.body.durationSeconds,
      status: req.body.status,
    });

    return res.json({
      message: 'Progress saved',
      ...result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Failed to save progress',
    });
  }
};

const handleContentInteraction = async (req, res) => {
  try {
    const { contentId, interactionType } = req.body;

    if (!isValidObjectId(contentId)) {
      return res.status(400).json({ message: 'Invalid contentId' });
    }

    const result = await recordContentInteraction({
      userId: getUserId(req),
      contentId,
      interactionType,
    });

    return res.json({
      message: 'Interaction saved',
      ...result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Failed to update interaction',
    });
  }
};

const deleteContent = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid content id' });
    }

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const isAdmin = getUserRole(req) === 'admin';
    const isOwner = content.createdBy?.toString() === userId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: 'You can only delete your own content',
      });
    }

    if (
      content.sourceKind === 'file' &&
      content.localPath &&
      fs.existsSync(content.localPath)
    ) {
      fs.unlinkSync(content.localPath);
    }

    await Review.deleteMany({ contentId: content._id });
    await Comment.deleteMany({ contentId: content._id });
    await Bookmark.deleteMany({ contentId: content._id });
    await UserProgress.deleteMany({ contentId: content._id });
    await content.deleteOne();

    return res.json({
      message: 'Content deleted successfully',
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to delete content',
      error: err.message,
    });
  }
};

export default {
  createContent,
  submitForApproval,
  getContent,
  getContentProgress,
  saveContentProgress,
  handleContentInteraction,
  listAllContent,
  listTopContent,
  listMyContent,
  deleteContent,
};
