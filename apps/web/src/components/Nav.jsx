"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import "./Nav.css";

const PanelIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path d="M12 4v16" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="4" width="7" height="7" rx="1.3" fill="currentColor" />
    <rect x="13" y="4" width="7" height="7" rx="1.3" fill="currentColor" />
    <rect x="4" y="13" width="7" height="7" rx="1.3" fill="currentColor" />
    <rect x="13" y="13" width="7" height="7" rx="1.3" fill="currentColor" />
  </svg>
);

const CoursesIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 5 3 9.5 12 14l9-4.5L12 5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M6 11.2V16l6 3 6-3v-4.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const LearningIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 9h8M8 12h8M8 15h5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.2" fill="currentColor" />
    <path d="M5 19a7 7 0 0 1 14 0" fill="currentColor" />
  </svg>
);

const AddIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 8v8M8 12h8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const SupportIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 18v-2.2A7 7 0 1 1 19 11.4V18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <rect
      x="4"
      y="14"
      width="3.2"
      height="5"
      rx="1.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <rect
      x="16.8"
      y="14"
      width="3.2"
      height="5"
      rx="1.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 19h3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const items = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/courses", label: "Courses", Icon: CoursesIcon },
  { href: "/my-learning", label: "My Learning", Icon: LearningIcon },
  { href: "/user-management", label: "User Management", Icon: UserIcon },
  { href: "/resources", label: "Add Resources", Icon: AddIcon },
  { href: "/support", label: "Support", Icon: SupportIcon },
];

export default function Nav({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();
  const [userName, setUserName] = useState("user");
  const [userRole, setUserRole] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "user");
    setUserRole(localStorage.getItem("role") || "");
    setIsCreator(localStorage.getItem("creator") === "true");
  }, []);

  const closeMobile = () => setMobileOpen(false);
  const visibleItems = items.filter((item) => {
    if (item.href !== "/resources") {
      return true;
    }

    return userRole === "admin" || isCreator;
  });

  return (
    <>
      <button
        type="button"
        className={`mobile-nav-overlay ${mobileOpen ? "show" : ""}`}
        onClick={closeMobile}
        aria-label="Close navigation overlay"
      />

      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-panel">
          <div className="sidebar-head">
            <Link href="/dashboard" className="brand-wrap" onClick={closeMobile}>
              <span className="brand-mark">Y</span>
              <span className="brand-text">Youfid</span>
            </Link>

            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <PanelIcon />
            </button>
          </div>

          <nav className="sidebar-nav">
            {visibleItems.map(({ href, label, Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === href
                  : pathname?.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  <span className="sidebar-icon">
                    <Icon />
                  </span>
                  <span className="sidebar-label">{label}</span>
                </Link>
              );
            })}
          </nav>

          <Link href="/Settings" className="sidebar-user" onClick={closeMobile}>
            <span className="user-avatar">
              <UserIcon />
            </span>
            <span className="user-copy">
              <strong>{userName}</strong>
              <small>{userRole}</small>
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
