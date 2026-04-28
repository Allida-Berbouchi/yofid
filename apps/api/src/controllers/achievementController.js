import AchievementEvent from '../models/AchievementEvent.js';
import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import { ensureAchievementCatalog } from '../services/achievementCatalog.js';
import { evaluateAchievementsForUser } from '../services/achievementEngine.js';

export async function getMyAchievements(req, res) {
  try {
    const userId = req.user.id;

    await ensureAchievementCatalog();
    await evaluateAchievementsForUser(userId, 'progress');

    const catalog = await Achievement.find({ isActive: true })
      .sort({ xp: 1, createdAt: 1 })
      .lean();

    const userAchievements = await UserAchievement.find({ userId }).lean();
    const byAchievementId = new Map(
      userAchievements.map((item) => [String(item.achievementId), item])
    );

    const achievements = catalog.map((achievement) => {
      const userAchievement = byAchievementId.get(String(achievement._id));

      return {
        ...achievement,
        userAchievementId: userAchievement?._id || null,
        status: userAchievement?.status || 'locked',
        progress: userAchievement?.progress || 0,
        target: achievement.criteria.target,
        unlockedAt: userAchievement?.unlockedAt || null,
        seenAt: userAchievement?.seenAt || null,
      };
    });

    const unlocked = achievements
      .filter((item) => item.status === 'unlocked')
      .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0));

    const unseen = unlocked.filter((item) => !item.seenAt);

    res.json({
      total: achievements.length,
      unlockedCount: unlocked.length,
      legendaryCount: unlocked.filter((item) =>
        ['legendary', 'mythic'].includes(item.rarity)
      ).length,
      xp: unlocked.reduce((sum, item) => sum + Number(item.xp || 0), 0),
      unseen,
      achievements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load achievements' });
  }
}

export async function evaluateMyAchievements(req, res) {
  try {
    const unlocked = await evaluateAchievementsForUser(req.user.id, 'progress');
    res.json({ unlocked });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to evaluate achievements' });
  }
}

export async function markAchievementSeen(req, res) {
  try {
    const updated = await UserAchievement.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { seenAt: new Date() } },
      { new: true }
    );

    if (updated) {
      await AchievementEvent.create({
        userId: req.user.id,
        achievementId: updated.achievementId,
        achievementKey: updated.achievementKey,
        type: 'achievement_seen',
        metadata: { userAchievementId: updated._id },
      });
    }

    res.json({ ok: true, achievement: updated });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to mark achievement as seen' });
  }
}
