import React from "react";
import "./Achievements.css";
import PremiumAchievementIcon from "./PremiumAchievementIcon";

const DEFAULT_DATA = [
  {
    id: 1,
    title: "100 Day Streak",
    description: "A discipline badge for showing up day after day.",
    rarity: "legendary",
    iconType: "flame",
    unlocked: true,
  },
  {
    id: 2,
    title: "Code Master",
    description: "Awarded for crushing coding paths with consistency.",
    rarity: "epic",
    iconType: "code",
    unlocked: true,
  },
  {
    id: 3,
    title: "Top Mentor",
    description: "Proof that your help made other learners stronger.",
    rarity: "rare",
    iconType: "community",
    unlocked: true,
  },
  {
    id: 4,
    title: "Early Adopter",
    description: "Reserved for the first learners shaping the platform.",
    rarity: "common",
    iconType: "rocket",
    unlocked: true,
  },
];

export default function Achievements({ data = DEFAULT_DATA }) {
  return (
    <div className="ach-container">
      <div className="ach-header">
        <div>
          <p className="ach-eyebrow">Growth Vault</p>
          <h2 className="ach-title">Achievements</h2>
        </div>
        <span className="ach-count">{data.filter((item) => item.unlocked).length} unlocked</span>
      </div>

      <div className="ach-grid">
        {data.map((a) => (
          <article
            key={a.id}
            className={`ach-card ${a.unlocked ? "is-unlocked" : "is-locked"}`}
          >
            <div className="ach-card-top">
              <span className={`ach-rarity ach-rarity-${a.rarity}`}>{a.rarity}</span>
              <span className={`ach-status ${a.unlocked ? "is-live" : ""}`}>
                {a.unlocked ? "Unlocked" : "Locked"}
              </span>
            </div>

            <div className="ach-icon">
              <PremiumAchievementIcon
                type={a.iconType}
                rarity={a.rarity}
                unlocked={a.unlocked}
                size={100}
              />
            </div>

            <div className="ach-copy">
              <h3 className="ach-label">{a.title}</h3>
              <p className="ach-description">{a.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
