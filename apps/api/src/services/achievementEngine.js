import Achievement from '../models/Achievement.js';
import AchievementEvent from '../models/AchievementEvent.js';
import UserAchievement from '../models/UserAchievement.js';
import UserProgress from '../models/UserProgress.js';
import { ensureAchievementCatalog } from './achievementCatalog.js';

function passes(operator, value, target) {
  if (operator === 'eq') {
    return value === target;
  }

  return value >= target;
}

async function getMetricValue(userId, metric) {
  if (metric === 'completed_content_count') {
    return UserProgress.countDocuments({ userId, status: 'completed' });
  }

  if (metric === 'started_content_count') {
    return UserProgress.countDocuments({
      userId,
      status: { $in: ['in_progress', 'completed'] },
    });
  }

  if (metric === 'perfect_progress_count') {
    return UserProgress.countDocuments({
      userId,
      status: 'completed',
      progressPercent: { $gte: 100 },
    });
  }

  return 0;
}

export async function evaluateAchievementsForUser(userId, source = 'progress') {
  await ensureAchievementCatalog();

  const achievements = await Achievement.find({ isActive: true }).lean();
  const newlyUnlocked = [];

  for (const achievement of achievements) {
    const existing = await UserAchievement.findOne({
      userId,
      achievementId: achievement._id,
    });

    if (existing?.status === 'unlocked') {
      continue;
    }

    const value = await getMetricValue(userId, achievement.criteria.metric);
    const target = achievement.criteria.target;
    const didPass = passes(achievement.criteria.operator, value, target);

    const update = {
      userId,
      achievementId: achievement._id,
      achievementKey: achievement.key,
      progress: Math.min(value, target),
      target,
      source,
      status: didPass ? 'unlocked' : value > 0 ? 'in_progress' : 'locked',
      ...(didPass ? { unlockedAt: existing?.unlockedAt || new Date() } : {}),
    };

    const saved = await UserAchievement.findOneAndUpdate(
      { userId, achievementId: achievement._id },
      { $set: update },
      { upsert: true, new: true }
    ).lean();

    if (didPass && existing?.status !== 'unlocked') {
      await AchievementEvent.create({
        userId,
        achievementId: achievement._id,
        achievementKey: achievement.key,
        type: 'achievement_unlocked',
        metadata: { value, target, source },
      });

      newlyUnlocked.push({
        ...saved,
        achievement: achievement,
      });
    }
  }

  return newlyUnlocked;
}
