import Content from '../models/Content.js';
import UserProgress from '../models/UserProgress.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const safeNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

function readCount(content, key) {
  return safeNumber(content?.interactionCounts?.[key]);
}

export async function recalculateContentEngagement(contentId) {
  const content = await Content.findById(contentId);

  if (!content) {
    return null;
  }

  const [progressStats] = await UserProgress.aggregate([
    { $match: { contentId: content._id } },
    {
      $group: {
        _id: '$contentId',
        learners: { $sum: 1 },
        avgProgress: { $avg: '$progressPercent' },
        completed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'completed'] }, 1, 0],
          },
        },
      },
    },
  ]);

  const learners = safeNumber(progressStats?.learners);
  const avgProgress = safeNumber(progressStats?.avgProgress);
  const completed = safeNumber(progressStats?.completed);
  const views = Math.max(safeNumber(content.totalViews), readCount(content, 'views'), learners);
  const likes = readCount(content, 'likes');
  const comments = readCount(content, 'comments');
  const earlyExits = readCount(content, 'earlyExits');
  const ratingScore = clamp01(safeNumber(content.averageRating) / 5);

  const completionRate = views > 0 ? completed / views : 0;
  const progressScore = clamp01(avgProgress / 100);
  const likeRate = views > 0 ? likes / views : 0;
  const commentRate = views > 0 ? comments / views : 0;
  const earlyExitRate = views > 0 ? earlyExits / views : 0;
  const popularityScore = clamp01(Math.log1p(views) / Math.log1p(100));

  content.totalViews = views;
  content.engagementScore = clamp01(
    popularityScore * 0.18 +
      progressScore * 0.25 +
      completionRate * 0.30 +
      clamp01(likeRate) * 0.12 +
      clamp01(commentRate) * 0.08 +
      ratingScore * 0.12 -
      clamp01(earlyExitRate) * 0.20
  );

  await content.save();
  return content;
}

export async function addContentSignals(contentId, signals = {}) {
  const inc = {};

  for (const [key, value] of Object.entries(signals)) {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount === 0) {
      continue;
    }

    if (key === 'totalViews') {
      inc.totalViews = (inc.totalViews || 0) + amount;
    } else {
      inc[`interactionCounts.${key}`] = amount;
    }
  }

  if (Object.keys(inc).length) {
    await Content.updateOne({ _id: contentId }, { $inc: inc });
  }

  return recalculateContentEngagement(contentId);
}
