import React from "react";
import "./Achievements.css";

const Icon = ({ type, color }) => {
  if (type === "medal") return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="13" r="9" stroke={color} strokeWidth="2" fill="none" />
      <polygon points="16,9 17.2,12.4 20.8,12.4 17.9,14.6 19.1,18 16,15.8 12.9,18 14.1,14.6 11.2,12.4 14.8,12.4" fill={color} />
      <rect x="13" y="21" width="6" height="2.5" rx="1" fill={color} />
      <rect x="11" y="23.5" width="10" height="2" rx="1" fill={color} />
    </svg>
  );
  if (type === "terminal") return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="7" width="24" height="5" rx="2" fill="#85B7EB" />
      <rect x="4" y="7" width="24" height="18" rx="3" stroke={color} strokeWidth="2" fill="none" />
      <polyline points="10,17 13,20 22,14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (type === "group") return (
    <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
      <circle cx="9" cy="10" r="5" fill="#378ADD" />
      <circle cx="25" cy="10" r="5" fill="#378ADD" />
      <circle cx="17" cy="8" r="6" fill={color} />
      <path d="M1 24 C1 18 5 15 9 15 C11 15 13 16 14.5 17.5" stroke="#378ADD" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M33 24 C33 18 29 15 25 15 C23 15 21 16 19.5 17.5" stroke="#378ADD" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M7 24 C7 19 11 16 17 16 C23 16 27 19 27 24" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
  if (type === "rocket") return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M20 4 C26 4 28 10 24 15 L14 26 L6 18 L17 8 C18.5 6.5 19.5 4 20 4Z" fill={color} />
      <circle cx="21" cy="11" r="2.5" fill="white" />
      <path d="M8 22 L6 28 L12 26 Z" fill="#888780" />
    </svg>
  );
  return null;
};

const DEFAULT_DATA = [
  { id: 1, label: "100 Day Streak", bgColor: "#9FE1CB", iconColor: "#0F6E56", type: "medal"    },
  { id: 2, label: "Code Master",    bgColor: "#B5D4F4", iconColor: "#185FA5", type: "terminal" },
  { id: 3, label: "Top Mentor",     bgColor: "#E6F1FB", iconColor: "#185FA5", type: "group"    },
  { id: 4, label: "Early Adopter",  bgColor: "#F1EFE8", iconColor: "#2C2C2A", type: "rocket"   },
];

export default function Achievements({ data = DEFAULT_DATA }) {
  return (
    <div className="ach-container">
      <h2 className="ach-title">Achievements</h2>
      <div className="ach-grid">
        {data.map((a) => (
          <div key={a.id} className="ach-card">
            <div className="ach-icon" style={{ backgroundColor: a.bgColor }}>
              <Icon type={a.type} color={a.iconColor} />
            </div>
            <span className="ach-label">{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}