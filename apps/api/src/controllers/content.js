import fs from "fs";

import Content from '../models/Content.js';
import Review from '../models/Review.js';
import Course from "../models/Course.js";
import Bookmark from "../models/Bookmark.js";
import UserProgress from "../models/UserProgress.js";

// --- Helper Functions ---
const getTypeFromMime = (mime) => {
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  return null;
};

const getTypeFromUrl = (value, selectedType) => {
  if (selectedType) return selectedType;
  const url = String(value || "").toLowerCase();
  if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com")) return "video";
  if (url.endsWith(".pdf")) return "pdf";
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)) return "image";
  return "video";
};

const clampScore = (value) => {
  if (value > 1) return 1;
  if (value < 0) return 0;
  return value;
};

const updateEngagementScore = async (contentId, scoreChange) => {
  try {
    const content = await Content.findById(contentId);

    if (!content) {
      return { error: "Content not found" };
    }

    content.engagementScore = clampScore(
      Number(content.engagementScore || 0) + Number(scoreChange || 0)
    );

    await content.save();
    return content;
  } catch (error) {
    return { error: error.message };
  }
};

const enrichContentItem = async (item) => {
  const contentId = item._id;

  const [reviewCount, commentCount, bookmarkCount, completionStats] =
    await Promise.all([
      Review.countDocuments({ contentId }),
      Review.countDocuments({
        contentId,
        comment: { $exists: true, $nin: [null, ""] },
      }),
      Bookmark.countDocuments({ contentId }),
      UserProgress.aggregate([
        { $match: { contentId } },
        {
          $group: {
            _id: "$contentId",
            total: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

  const completionTotal = completionStats[0]?.total || 0;
  const completionCount = completionStats[0]?.completed || 0;
  const completionRate = completionTotal
    ? Math.round((completionCount / completionTotal) * 100)
    : 0;

  return {
    ...item.toObject(),
    reviewCount,
    commentCount,
    bookmarkCount,
    completionRate,
  };
};

// --- Exported Methods ---

const createContent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, category, subject, gradeLevel, courseId } = req.body;

    let urlItems = req.body.urlItems ? JSON.parse(req.body.urlItems) : [];

    // Validation: Must have at least one file or one URL
    if ((!req.files || req.files.length === 0) && urlItems.length === 0) {
      return res.status(400).json({ message: "Please upload at least one file or one URL" });
    }

    if (courseId) {
      const course = await Course.findOne({ _id: courseId, createdBy: userId });
      if (!course) return res.status(404).json({ message: "Course not found" });
    }

    const docsToCreate = [];

    // 1. Handle Uploaded Files (from Multer)
    for (const file of req.files || []) {
      const type = getTypeFromMime(file.mimetype);
      if (!type) continue;

      docsToCreate.push({
        title: title || file.originalname,
        description: description || "",
        category: category || "",
        subject: subject || "",
        gradeLevel: gradeLevel || "",
        type,
        sourceKind: "file",
        url: `/uploads/${file.filename}`,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageType: "local",
        localPath: file.path,
        courseId: courseId || null,
        createdBy: userId,
      });
    }

    // 2. Handle External URLs
    for (const item of urlItems) {
      if (!item?.url) continue;
      docsToCreate.push({
        title: item.title || title || "Untitled URL Content",
        description: item.description || description || "",
        category: item.category || category || "",
        subject: subject || "",
        gradeLevel: gradeLevel || "",
        type: getTypeFromUrl(item.url, item.type),
        sourceKind: "url",
        url: item.url,
        storageType: "external",
        courseId: courseId || null,
        createdBy: userId,
      });
    }

    const created = await Content.insertMany(docsToCreate);
    res.status(201).json({ message: "Content created successfully", items: created });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listAllContent = async (req, res) => {
  try {
    const content = await Content.find()
      .populate('createdBy', 'name email role')
      .sort({ engagementScore: -1, createdAt: -1 });

    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listTopContent = async (req, res) => {
  try {
    const allApprovedContent = await Content.find({ status: "approved" }).sort({
      engagementScore: -1,
      totalViews: -1,
      createdAt: -1,
    });

    const content = allApprovedContent
      .slice(0, 10);

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
    res.json({
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
    res.status(500).json({ error: err.message });
  }
};

const listMyContent = async (req, res) => {
  try {
    const query = req.account?.role === "admin"
      ? {}
      : { createdBy: req.user.id };

    const content = await Content.find(query)
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitForApproval = async (req, res) => {
  try {
    const { contentId } = req.body;
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    content.status = 'pending';
    await content.save();
    res.json({ message: 'Content submitted for approval', contentId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { contentId, rating, comment } = req.body;
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    const review = await Review.create({
      contentId,
      userId: req.user.id,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { contentId: content._id } },
      { $group: { _id: '$contentId', averageRating: { $avg: '$rating' } } },
    ]);

    content.averageRating = stats[0]?.averageRating ?? rating;
    await content.save();

    res.status(201).json({ message: 'Review added', reviewId: review._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleContentInteraction = async (req, res) => {
  try {
    const { contentId, interactionType } = req.body;
    let scoreChange = 0;

    switch (interactionType) {
      case "like":
        scoreChange = 0.1;
        break;
      case "comment":
        scoreChange = 0.05;
        break;
      case "earlyExit":
        scoreChange = -0.1;
        break;
      case "complete":
        scoreChange = 0.1;
        break;
      default:
        return res.status(400).json({ message: "Invalid interaction" });
    }

    const updatedContent = await updateEngagementScore(contentId, scoreChange);

    if (updatedContent.error) {
      return res.status(404).json({ message: updatedContent.error });
    }

    return res.json({
      message: "Score updated successfully",
      updatedContent,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const isAdmin = req.account?.role === "admin";
    const isOwner = content.createdBy?.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "You can only delete your own content" });
    }

    if (content.sourceKind === "file" && content.localPath && fs.existsSync(content.localPath)) {
      fs.unlinkSync(content.localPath);
    }

    await content.deleteOne();

    return res.json({ message: "Content deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default {
  createContent,
  submitForApproval,
  getContent,
  addReview,
  handleContentInteraction,
  listAllContent,
  listTopContent,
  listMyContent,
  deleteContent,
};
