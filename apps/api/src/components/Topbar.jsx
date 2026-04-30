"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="11"
      cy="11"
      r="6.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M16 16 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 10a5 5 0 0 1 10 0v4l1.5 2H5.5L7 14v-4Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M10 18a2 2 0 0 0 4 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const GearIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 8.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M19 12a7 7 0 0 0-.08-1l1.86-1.45-1.6-2.78-2.28.63a7.1 7.1 0 0 0-1.72-1L14.8 4h-3.2l-.38 2.4a7.1 7.1 0 0 0-1.72 1l-2.28-.63-1.6 2.78L7.48 11a7 7 0 0 0 0 2l-1.86 1.45 1.6 2.78 2.28-.63a7.1 7.1 0 0 0 1.72 1l.38 2.4h3.2l.38-2.4a7.1 7.1 0 0 0 1.72-1l2.28.63 1.6-2.78L18.92 13c.05-.33.08-.66.08-1Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Topbar({
  placeholder = "Search architecture, languages, or tools...",
  settingsActive = false,
}) {
  const [level, setLevel] = useState(null);

  useEffect(() => {
    setLevel(localStorage.getItem("level"));
  }, []);

  return (
    <header className="topbar">
      <label className="topbar-search">
        <span className="topbar-search-icon">
          <SearchIcon />
        </span>
        <input type="text" placeholder={placeholder} />
      </label>

      <div className="topbar-actions">
        <button
          type="button"
          className="topbar-icon-btn"
          aria-label="Notifications"
        >
          <BellIcon />
        </button>
        <Link
          href="/Settings"
          className={`topbar-icon-btn ${settingsActive ? "is-active" : ""}`}
          aria-label="Settings"
        >
          <GearIcon />
        </Link>
        <span className="level-pill">LVL {level}</span>
      </div>
    </header>
  );
}
