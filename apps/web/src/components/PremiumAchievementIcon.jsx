import React, { useId } from "react";

const RARITY_STYLES = {
  common: {
    edge: "#8fa4b8",
    mid: "#d8e1ea",
    glow: "#edf4fb",
    core: "#4c6076",
    shadow: "rgba(46, 67, 87, 0.38)",
  },
  rare: {
    edge: "#176cff",
    mid: "#7fd1ff",
    glow: "#ebf8ff",
    core: "#08388f",
    shadow: "rgba(13, 73, 188, 0.42)",
  },
  epic: {
    edge: "#7230ff",
    mid: "#d89bff",
    glow: "#f7e8ff",
    core: "#34106f",
    shadow: "rgba(99, 39, 181, 0.46)",
  },
  legendary: {
    edge: "#b87600",
    mid: "#ffd66b",
    glow: "#fff8dc",
    core: "#5f3800",
    shadow: "rgba(129, 84, 0, 0.5)",
  },
  mythic: {
    edge: "#d21f6f",
    mid: "#ff9ae1",
    glow: "#fff0fa",
    core: "#670032",
    shadow: "rgba(149, 16, 84, 0.52)",
  },
};

function Glyph({ type, stroke = "#ffffff" }) {
  const props = {
    fill: "none",
    stroke,
    strokeWidth: 5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "rocket":
      return (
        <g {...props}>
          <path d="M74 26c15 2 25 13 28 28-13 1-26 8-36 18L47 91 37 81l19-19c10-10 17-23 18-36Z" />
          <circle cx="78" cy="50" r="7" />
          <path d="M47 91l-16 6 6-16M55 63L40 59l-11 11 18 6M65 73l4 15-11 11-6-18" />
        </g>
      );
    case "flame":
      return (
        <g {...props}>
          <path d="M64 103c18-8 29-22 27-39-2-18-17-27-17-39-12 8-17 20-14 33-9-6-12-15-11-25-15 12-24 27-22 45 2 18 17 29 37 25Z" />
          <path d="M64 92c9-5 14-13 13-22-1-8-7-14-9-22-8 8-12 15-10 25-5-2-8-7-9-13-7 8-10 17-8 25 2 9 10 12 23 7Z" />
        </g>
      );
    case "crown":
      return (
        <g {...props}>
          <path d="M32 82h64l6-42-23 20-15-30-15 30-23-20 6 42Z" />
          <path d="M34 94h60M42 82v12M86 82v12" />
          <circle cx="64" cy="30" r="4" fill={stroke} />
        </g>
      );
    case "medal":
      return (
        <g {...props}>
          <path d="M45 23l12 24M83 23 71 47" />
          <circle cx="64" cy="70" r="25" />
          <path d="m64 55 5 10 11 2-8 8 2 12-10-6-10 6 2-12-8-8 11-2 5-10Z" />
        </g>
      );
    case "terminal":
    case "code":
      return (
        <g {...props} strokeWidth={6}>
          <path d="M48 46 30 64l18 18M80 46l18 18-18 18M70 38 58 90" />
        </g>
      );
    case "community":
    case "group":
      return (
        <g {...props}>
          <circle cx="64" cy="45" r="14" />
          <circle cx="35" cy="55" r="10" />
          <circle cx="93" cy="55" r="10" />
          <path d="M39 99c2-18 13-27 25-27s23 9 25 27" />
          <path d="M18 96c2-14 9-22 20-22M110 96c-2-14-9-22-20-22" />
        </g>
      );
    case "shield":
      return (
        <g {...props}>
          <path d="M64 24 95 36v25c0 22-13 38-31 45-18-7-31-23-31-45V36l31-12Z" />
          <path d="m49 65 10 10 22-25" />
        </g>
      );
    case "brain":
      return (
        <g {...props}>
          <path d="M50 35c-10 0-18 8-18 18 0 4 1 7 3 10-6 4-8 13-4 20 4 8 14 11 22 7 4 8 17 8 22 0 8 4 18 1 22-7 4-7 2-16-4-20 2-3 3-6 3-10 0-10-8-18-18-18-3-9-25-9-28 0Z" />
          <path d="M53 35v56M75 35v56M41 58h22M65 67h24M42 79h18M73 49h13" />
        </g>
      );
    case "compass":
      return (
        <g {...props}>
          <circle cx="64" cy="64" r="36" />
          <path d="M76 40 65 70 52 88l11-31 13-17Z" />
          <circle cx="64" cy="64" r="4" fill={stroke} />
        </g>
      );
    case "star":
    default:
      return (
        <g {...props}>
          <path d="m64 24 12 25 28 4-20 20 5 28-25-13-25 13 5-28-20-20 28-4 12-25Z" />
        </g>
      );
  }
}

function LockGlyph() {
  return (
    <g
      fill="none"
      stroke="#ffffff"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="41" y="58" width="46" height="38" rx="8" />
      <path d="M51 58V45c0-10 6-18 13-18s13 8 13 18v13" />
    </g>
  );
}

export default function PremiumAchievementIcon({
  type = "star",
  rarity = "legendary",
  unlocked = true,
  size = 112,
  className = "",
}) {
  const iconId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const palette = RARITY_STYLES[rarity] || RARITY_STYLES.legendary;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      role="img"
      aria-label={`${rarity} achievement`}
      className={className}
      style={{
        display: "block",
        filter: `drop-shadow(0 16px 24px ${palette.shadow})`,
      }}
    >
      <defs>
        <radialGradient id={`rim-${iconId}`} cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor={palette.glow} />
          <stop offset="42%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.edge} />
        </radialGradient>

        <radialGradient id={`core-${iconId}`} cx="45%" cy="30%" r="78%">
          <stop offset="0%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.core} />
        </radialGradient>

        <linearGradient id={`ribbon-${iconId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.edge} />
          <stop offset="45%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.core} />
        </linearGradient>
      </defs>

      <g opacity={unlocked ? 1 : 0.5}>
        <path
          d="M38 77 22 120l23-10 15 18 12-48Z"
          fill={`url(#ribbon-${iconId})`}
        />
        <path
          d="M90 77 106 120l-23-10-15 18-12-48Z"
          fill={`url(#ribbon-${iconId})`}
        />

        <circle cx="64" cy="58" r="50" fill={`url(#rim-${iconId})`} />
        <circle
          cx="64"
          cy="58"
          r="43"
          fill="none"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="4"
        />
        <circle cx="64" cy="58" r="35" fill={`url(#core-${iconId})`} />
        <circle
          cx="64"
          cy="58"
          r="30"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
        />

        <path
          d="M31 54c4-17 17-30 33-34 16 4 29 17 33 34"
          fill="none"
          stroke="rgba(255,255,255,0.36)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <g transform="translate(0 4) scale(0.56) translate(50 28)">
          {unlocked ? <Glyph type={type} /> : <LockGlyph />}
        </g>
      </g>
    </svg>
  );
}
