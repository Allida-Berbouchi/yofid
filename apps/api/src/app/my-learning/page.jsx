"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  fetchContentList,
  fetchCurrentUser,
  fetchMyAchievements,
  fetchUserProgress,
  markAchievementSeen,
} from "@/lib/api";
import AppLayout from "@/components/AppLayout";
import PremiumAchievementIcon from "@/components/PremiumAchievementIcon";
import Topbar from "@/components/Topbar";

function formatDate(value) {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPercent(value) {
  return `${Math.round(Number(value || 0))}%`;
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getContentIconType(item = {}) {
  const haystack = `${item.category || ""} ${item.subject || ""} ${item.title || ""}`.toLowerCase();

  if (haystack.includes("cloud")) return "rocket";
  if (haystack.includes("security")) return "shield";
  if (haystack.includes("ai") || haystack.includes("neural") || haystack.includes("data")) return "brain";
  if (haystack.includes("system") || haystack.includes("architecture")) return "shield";
  if (haystack.includes("design") || haystack.includes("ux")) return "star";
  if (haystack.includes("code") || haystack.includes("javascript") || haystack.includes("react")) return "code";
  if (item.type === "video") return "rocket";
  if (item.type === "pdf") return "medal";

  return "compass";
}

function getProgressRarity(progressItem = {}) {
  const percent = Number(progressItem.progressPercent || 0);
  const status = progressItem.status;

  if (status === "completed" || percent >= 100) return "legendary";
  if (percent >= 80) return "epic";
  if (percent >= 40) return "rare";
  return "common";
}

function getRemainingLabel(progressItem = {}, contentItem = {}) {
  const percent = Math.max(0, Math.min(100, Number(progressItem.progressPercent || 0)));
  const duration = Number(contentItem.duration || 0);

  if (progressItem.status === "completed" || percent >= 100) {
    return "completed";
  }

  if (duration > 0) {
    const remainingMinutes = Math.max(0, Math.round(duration * (1 - percent / 100)));
    if (remainingMinutes >= 60) {
      const hours = Math.max(1, Math.round((remainingMinutes / 60) * 10) / 10);
      return `${hours}h remaining`;
    }
    return `${remainingMinutes}m remaining`;
  }

  if (percent > 0) {
    return "in progress";
  }

  return "ready to start";
}

export default function MyLearningPage() {
  const [user, setUser] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [progressItems, setProgressItems] = useState([]);
  const [achievementData, setAchievementData] = useState({
    total: 0,
    unlockedCount: 0,
    legendaryCount: 0,
    xp: 0,
    unseen: [],
    achievements: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [currentUser, content, progress, achievements] = await Promise.all([
          fetchCurrentUser(),
          fetchContentList(),
          fetchUserProgress(),
          fetchMyAchievements().catch((achievementError) => {
            console.error("Failed to load achievements:", achievementError);
            return {
              total: 0,
              unlockedCount: 0,
              legendaryCount: 0,
              xp: 0,
              unseen: [],
              achievements: [],
            };
          }),
        ]);

        if (cancelled) {
          return;
        }

        setUser(currentUser);
        setContentItems(content);
        setProgressItems(Array.isArray(progress) ? progress : []);
        setAchievementData(achievements);

        // If there are achievements that are unlocked but not yet marked "seen",
        // mark them on the backend AND refresh UI state so the user sees it instantly.
        const unseenIds = (achievements?.unseen || [])
          .map((item) => item.userAchievementId)
          .filter(Boolean);

        if (unseenIds.length) {
          await Promise.allSettled(unseenIds.map((id) => markAchievementSeen(id)));

          try {
            const refreshed = await fetchMyAchievements();
            if (!cancelled) setAchievementData(refreshed);
          } catch (refreshError) {
            console.error("Failed to refresh achievements after marking seen:", refreshError);
          }
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setError(loadError.message || "Failed to load your learning data.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const pageData = useMemo(() => {
    const contentById = new Map(
      contentItems.map((item) => [String(item._id), item])
    );

    const progressWithContent = progressItems
      .map((progress) => ({
        ...progress,
        content: contentById.get(String(progress.contentId)),
      }))
      .filter((item) => item.content);

    const activeLearning = progressWithContent
      .filter((item) => {
        const percent = Number(item.progressPercent || 0);
        return item.status === "in_progress" || (percent > 0 && percent < 100);
      })
      .sort((a, b) => {
        const percentDiff = Number(b.progressPercent || 0) - Number(a.progressPercent || 0);
        if (percentDiff !== 0) return percentDiff;
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      });

    const completedLearning = progressWithContent
      .filter((item) => item.status === "completed" || Number(item.progressPercent || 0) >= 100)
      .sort((a, b) => {
        const completedDiff = new Date(b.completedAt || b.updatedAt || 0) - new Date(a.completedAt || a.updatedAt || 0);
        if (completedDiff !== 0) return completedDiff;
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      });

    const startedIds = new Set(progressWithContent.map((item) => String(item.contentId)));
    const nextUp = contentItems
      .filter((item) => !startedIds.has(String(item._id)))
      .filter((item) => !item.status || item.status === "approved")
      .sort((a, b) => {
        const scoreDiff = Number(b.engagementScore || 0) - Number(a.engagementScore || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return Number(b.averageRating || 0) - Number(a.averageRating || 0);
      });

    const unlockedAchievements = [...(achievementData.achievements || [])]
      .filter((item) => item.status === "unlocked")
      .sort((a, b) => new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0));

    const pendingAchievements = [...(achievementData.achievements || [])]
      .filter((item) => item.status !== "unlocked")
      .map((item) => {
        const target = Math.max(Number(item.target || 1), 1);
        return {
          ...item,
          percent: Math.min(100, Math.round((Number(item.progress || 0) / target) * 100)),
        };
      })
      .sort((a, b) => b.percent - a.percent);

    const continueNextUp = nextUp[0] || null;

    const continueItem =
      activeLearning[0] ||
      completedLearning[0] ||
      (continueNextUp
        ? {
            ...continueNextUp,
            // unify shape so render can always use `.content.*`
            content: continueNextUp,
            progressPercent: 0,
            status: "not_started",
          }
        : null);

    const spotlightAchievement = unlockedAchievements[0] || pendingAchievements[0] || null;

    const activeCatalog = [...activeLearning, ...completedLearning].slice(0, 6);
    const averageMastery = progressWithContent.length
      ? Math.round(
          progressWithContent.reduce(
            (sum, item) => sum + Number(item.progressPercent || 0),
            0
          ) / progressWithContent.length
        )
      : 0;

    return {
      continueItem,
      nextItem: nextUp[0] || activeLearning[1] || null,
      activeCatalog,
      completedLearning,
      unlockedAchievements,
      pendingAchievements,
      spotlightAchievement,
      startedCount: progressWithContent.length,
      completedCount: completedLearning.length,
      averageMastery,
    };
  }, [achievementData.achievements, contentItems, progressItems]);

  const continueWatchId =
    pageData.continueItem?.content?._id || pageData.continueItem?._id;

  const heroSubtitle = useMemo(() => {
    if (!pageData.startedCount && !achievementData.unlockedCount) {
      return "Start your first resource and your progress, mastery, and achievements will appear here.";
    }

    return [
      `You have ${pluralize(pageData.startedCount, "tracked resource")}.`,
      `${pluralize(pageData.completedCount, "resource")} completed.`,
      `${pluralize(achievementData.unlockedCount || 0, "achievement")} unlocked.`,
    ].join(" ");
  }, [achievementData.unlockedCount, pageData.completedCount, pageData.startedCount]);

  const achievementHighlights = useMemo(() => {
    if (pageData.unlockedAchievements.length) {
      return pageData.unlockedAchievements.slice(0, 3);
    }

    return pageData.pendingAchievements.slice(0, 3);
  }, [pageData.pendingAchievements, pageData.unlockedAchievements]);

  return (
    <AppLayout>
      <Topbar />
      <div className="page-shell">
        <section className="page-head">
          <h1 className="page-title">
            Welcome back{user?.name ? `, ${user.name}` : ""}.
          </h1>
          <p className="page-subtitle">{loading ? "Loading your learning data..." : heroSubtitle}</p>
        </section>

        {error && (
          <div className="section-card" style={{ padding: 28, color: "var(--danger)", marginBottom: 20 }}>
            {error}
          </div>
        )}

        <section className="featured-grid">
          <article className="section-card feature-card">
            <div className="feature-cover feature-1">
              <span className="soft-badge blue">
                {pageData.continueItem?.status === "completed"
                  ? "REVIEW AGAIN"
                  : pageData.continueItem?.status === "in_progress"
                    ? "CONTINUE LEARNING"
                    : "READY TO START"}
              </span>
            </div>
            <div className="feature-body">
              <h3 className="feature-title">
                {pageData.continueItem?.content?.title ||
                  pageData.continueItem?.title ||
                  "Pick your next learning session"}
              </h3>
              <p>
                {pageData.continueItem?.content?.description ||
                  pageData.continueItem?.description ||
                  "Your next focused session will appear here as soon as you begin tracking progress."}
              </p>
              <div className="feature-actions">
                <div style={{ flex: 1 }}>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: formatPercent(pageData.continueItem?.progressPercent || 0) }}
                    />
                  </div>
                  <div className="feature-meta-line">
                    <span>{formatPercent(pageData.continueItem?.progressPercent || 0)} mastery</span>
                    <span>
                      {pageData.continueItem
                        ? getRemainingLabel(pageData.continueItem, pageData.continueItem.content)
                        : "No active resource yet"}
                    </span>
                  </div>
                </div>
                <Link
                  href={continueWatchId ? `/watch?id=${continueWatchId}` : "/resources"}
                  className="primary-action feature-link-button"
                >
                  {pageData.continueItem?.status === "completed"
                    ? "REVIEW"
                    : pageData.continueItem?.status === "in_progress"
                      ? "RESUME"
                      : "START"}
                </Link>
              </div>
            </div>
          </article>

          <article className="section-card feature-card">
            <div className="feature-cover feature-2 feature-cover-split">
              <span className="soft-badge green">
                {pageData.spotlightAchievement?.status === "unlocked"
                  ? "LATEST ACHIEVEMENT"
                  : "NEXT ACHIEVEMENT"}
              </span>
              <PremiumAchievementIcon
                type={pageData.spotlightAchievement?.iconType || "star"}
                rarity={pageData.spotlightAchievement?.rarity || "common"}
                unlocked={pageData.spotlightAchievement?.status === "unlocked"}
                size={108}
                className="feature-cover-icon"
              />
            </div>
            <div className="feature-body">
              <h3 className="feature-title">
                {pageData.spotlightAchievement?.title || "Your achievement vault is ready"}
              </h3>
              <p>
                {pageData.spotlightAchievement?.description
                  || "Complete learning resources to unlock your first real achievement badge."}
              </p>
              <div className="feature-actions">
                <div style={{ flex: 1 }}>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: formatPercent(
                          pageData.spotlightAchievement?.status === "unlocked"
                            ? 100
                            : pageData.spotlightAchievement?.percent || 0
                        ),
                      }}
                    />
                  </div>
                  <div className="feature-meta-line">
                    <span>
                      {pageData.spotlightAchievement?.status === "unlocked"
                        ? `Unlocked ${formatDate(pageData.spotlightAchievement?.unlockedAt)}`
                        : `${pageData.spotlightAchievement?.progress || 0}/${pageData.spotlightAchievement?.target || 1} progress`}
                    </span>
                    <span>{achievementData.xp || 0} XP total</span>
                  </div>
                </div>
                <Link
                  href={pageData.nextItem?._id ? `/watch?id=${pageData.nextItem._id}` : "/dashboard"}
                  className="secondary-action feature-link-button"
                >
                  {pageData.nextItem?._id ? "START NEXT" : "EXPLORE"}
                </Link>
              </div>
            </div>
          </article>
        </section>

        <div className="section-label">ACTIVE LEARNING</div>

        <section className="learning-list">
          {loading ? (
            <article className="section-card learning-item">
              <div className="learning-copy">
                <h3>Loading your tracked resources...</h3>
                <p>We are pulling together your progress and recent activity.</p>
              </div>
            </article>
          ) : pageData.activeCatalog.length ? (
            pageData.activeCatalog.map((item) => (
              <article key={`${item.contentId}-${item.content?._id}`} className="section-card learning-item">
                <div className="learning-icon-box premium-learning-icon-box">
                  <PremiumAchievementIcon
                    type={getContentIconType(item.content)}
                    rarity={getProgressRarity(item)}
                    unlocked
                    size={54}
                  />
                </div>
                <div className="learning-copy">
                  <h3>{item.content.title}</h3>
                  <p>
                    {item.content.category || item.content.subject || "General learning"}
                    {" · "}
                    {item.status === "completed" ? "Completed" : "In progress"}
                  </p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: formatPercent(item.progressPercent || 0) }} />
                  </div>
                </div>
                <div className="learning-stats">
                  <strong>{formatPercent(item.progressPercent || 0)}</strong>
                  <span>{getRemainingLabel(item, item.content)}</span>
                  <Link href={`/watch?id=${item.content._id}`} className="learning-item-link">
                    Open
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <article className="section-card learning-item">
              <div className="learning-copy">
                <h3>No tracked learning yet</h3>
                <p>Start a resource from the library and your active learning dashboard will appear here.</p>
              </div>
              <div className="learning-stats">
                <Link href="/resources" className="learning-item-link">
                  Browse resources
                </Link>
              </div>
            </article>
          )}
        </section>

        <div className="section-label">ACHIEVEMENT VAULT</div>

        <section className="milestone-grid">
          <article className="section-card milestone-card">
            <div className="milestone-hero">
              <div className="milestone-badge-copy">
                <span className="soft-badge green">
                  {pageData.spotlightAchievement?.status === "unlocked" ? "UNLOCKED" : "IN PROGRESS"}
                </span>
                <div className="big-title">
                  {pageData.spotlightAchievement?.title || "Your first achievement is waiting"}
                </div>
              </div>

              <PremiumAchievementIcon
                type={pageData.spotlightAchievement?.iconType || "star"}
                rarity={pageData.spotlightAchievement?.rarity || "common"}
                unlocked={pageData.spotlightAchievement?.status === "unlocked"}
                size={148}
                className="milestone-premium-icon"
              />
            </div>

            <h3>
              {pageData.spotlightAchievement?.status === "unlocked"
                ? `Unlocked on ${formatDate(pageData.spotlightAchievement?.unlockedAt)}`
                : `Closest unlock: ${pageData.spotlightAchievement?.progress || 0}/${pageData.spotlightAchievement?.target || 1}`}
            </h3>
            <p className="page-subtitle" style={{ fontSize: "16px" }}>
              {pageData.spotlightAchievement?.description
                || "Finish resources and raise mastery to unlock badges that reflect real learning."}
            </p>

            <div className="milestone-achievement-strip">
              {achievementHighlights.length ? (
                achievementHighlights.map((item) => (
                  <div key={item.key} className="milestone-achievement-chip">
                    <PremiumAchievementIcon
                      type={item.iconType || "star"}
                      rarity={item.rarity || "common"}
                      unlocked={item.status === "unlocked"}
                      size={64}
                    />
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        {item.status === "unlocked"
                          ? `Unlocked ${formatDate(item.unlockedAt)}`
                          : `${item.progress || 0}/${item.target || 1} progress`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="milestone-achievement-chip">
                  <PremiumAchievementIcon type="star" rarity="common" unlocked={false} size={64} />
                  <div>
                    <strong>No achievements unlocked yet</strong>
                    <span>Start and finish resources to build your vault.</span>
                  </div>
                </div>
              )}
            </div>
          </article>

          <div className="metric-stack">
            <article className="section-card metric-card">
              <div className="metric-icon-row">
                <PremiumAchievementIcon type="medal" rarity="rare" unlocked size={78} />
              </div>
              <h4>Achievements Unlocked</h4>
              <strong>{achievementData.unlockedCount || 0}</strong>
              <span>{achievementData.xp || 0} XP earned</span>
            </article>
            <article className="section-card metric-card">
              <div className="metric-icon-row">
                <PremiumAchievementIcon type="brain" rarity="epic" unlocked size={78} />
              </div>
              <h4 style={{ color: "#4b69b1" }}>Average Mastery</h4>
              <strong>{pageData.averageMastery}%</strong>
              <span>{pluralize(pageData.completedCount, "resource")} completed</span>
            </article>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
