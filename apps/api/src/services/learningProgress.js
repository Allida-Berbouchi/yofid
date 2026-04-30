import Content from '../models/Content.js';
import UserProgress from '../models/UserProgress.js';
import { evaluateAchievementsForUser } from './achievementEngine.js';
import { addContentSignals } from './contentScoring.js';

const clampPercent = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, number));
};

const normalizeSeconds = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return number;
};

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export async function recordLearningProgress({
  userId,
  contentId,
  interactionType = 'progress',
  progressPercent,
  lastPosition,
  durationSeconds,
  status,
}) {
  if (!userId) {
    throw httpError(401, 'Unauthorized');
  }

  const content = await Content.findById(contentId);

  if (!content) {
    throw httpError(404, 'Content not found');
  }

  const now = new Date();
  let progress = await UserProgress.findOne({ userId, contentId });
  const isNewProgress = !progress;
  const previousStatus = progress?.status || 'not_started';

  if (!progress) {
    progress = new UserProgress({
      userId,
      contentId,
      status: 'not_started',
      firstViewedAt: now,
    });
  }

  const nextPercent = clampPercent(progressPercent);
  const nextPosition = normalizeSeconds(lastPosition);
  const nextDuration = normalizeSeconds(durationSeconds);

  if (!progress.firstViewedAt) {
    progress.firstViewedAt = now;
  }

  progress.lastViewedAt = now;

  if (interactionType === 'view' || isNewProgress) {
    progress.viewCount = Number(progress.viewCount || 0) + 1;
  }

  if (nextPercent !== null) {
    progress.progressPercent = Math.max(Number(progress.progressPercent || 0), nextPercent);
  }

  if (nextPosition !== null) {
    progress.lastPosition = nextPosition;
  }

  if (nextDuration !== null) {
    progress.durationSeconds = Math.max(Number(progress.durationSeconds || 0), nextDuration);
  }

  const shouldComplete =
    interactionType === 'complete' ||
    status === 'completed' ||
    Number(progress.progressPercent || 0) >= 95;

  if (shouldComplete) {
    progress.status = 'completed';
    progress.progressPercent = 100;
    progress.completedAt = progress.completedAt || now;
  } else if (
    interactionType === 'view' ||
    interactionType === 'progress' ||
    Number(progress.progressPercent || 0) > 0
  ) {
    progress.status = 'in_progress';
  }

  await progress.save();

  const signals = {};

  if (isNewProgress || interactionType === 'view') {
    signals.views = 1;
    signals.totalViews = 1;
  }

  if (isNewProgress || (previousStatus === 'not_started' && progress.status !== 'not_started')) {
    signals.starts = 1;
  }

  if (interactionType === 'progress' || nextPercent !== null) {
    signals.progressUpdates = 1;
  }

  if (progress.status === 'completed' && previousStatus !== 'completed') {
    signals.completions = 1;
  }

  const updatedContent = await addContentSignals(contentId, signals);
  const unlockedAchievements = await evaluateAchievementsForUser(userId, 'progress');

  return {
    progress: progress.toObject(),
    updatedContent,
    unlockedAchievements,
  };
}

export async function recordContentInteraction({ userId, contentId, interactionType }) {
  if (!userId) {
    throw httpError(401, 'Unauthorized');
  }

  const content = await Content.findById(contentId);

  if (!content) {
    throw httpError(404, 'Content not found');
  }

  if (['view', 'progress', 'complete'].includes(interactionType)) {
    return recordLearningProgress({ userId, contentId, interactionType });
  }

  const signalByType = {
    like: { likes: 1 },
    comment: { comments: 1 },
    earlyExit: { earlyExits: 1 },
  };

  const signals = signalByType[interactionType];

  if (!signals) {
    throw httpError(400, 'Invalid interaction');
  }

  const updatedContent = await addContentSignals(contentId, signals);

  return {
    progress: await UserProgress.findOne({ userId, contentId }).lean(),
    updatedContent,
    unlockedAchievements: [],
  };
}
