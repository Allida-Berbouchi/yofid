"use client";

import { useEffect } from "react";
import PremiumAchievementIcon from "./PremiumAchievementIcon";
import "./AchievementUnlockOverlay.css";

const DEFAULT_DURATION_MS = 300000;

function getAchievementInfo(item = {}) {
  const achievement = item.achievement || item;

  return {
    title: achievement.title || item.achievementKey || "Achievement unlocked",
    description:
      achievement.description ||
      "A new milestone was added to your achievement vault.",
    rarity: achievement.rarity || item.rarity || "legendary",
    iconType: achievement.iconType || item.iconType || "book",
    xp: achievement.xp || item.xp || 0,
  };
}

export default function AchievementUnlockOverlay({
  achievement,
  durationMs = DEFAULT_DURATION_MS,
  onDismiss,
}) {
  const info = getAchievementInfo(achievement);

  useEffect(() => {
    if (!achievement) return undefined;

    const timer = window.setTimeout(() => {
      onDismiss?.(achievement);
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [achievement, durationMs, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="achievement-unlock-screen" role="dialog" aria-modal="true">
      <div className="achievement-unlock-aurora" />
      <div className="achievement-unlock-grid" />

      <section className="achievement-unlock-card">
        <div className="achievement-unlock-rays" />
        <p className="achievement-unlock-kicker">New achievement unlocked</p>

        <div className="achievement-unlock-icon-ring">
          <PremiumAchievementIcon
            type={info.iconType}
            rarity={info.rarity}
            unlocked
            size={190}
            className="achievement-unlock-icon"
          />
        </div>

        <h2>{info.title}</h2>
        <p className="achievement-unlock-description">{info.description}</p>

        <div className="achievement-unlock-meta">
          <span>{info.rarity}</span>
          <span>{info.xp} XP</span>
        </div>

        <button type="button" onClick={() => onDismiss?.(achievement)}>
          Continue learning
        </button>
      </section>
    </div>
  );
}
