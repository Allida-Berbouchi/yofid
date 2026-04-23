"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

const STORAGE_KEY = "youfid.sidebar.collapsed";

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "auto";
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className={`app-shell ${collapsed ? "nav-collapsed" : "nav-expanded"}`}>
      <Nav
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="app-main">
        <button
          className="mobile-nav-trigger"
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          Menu
        </button>
        {children}
      </main>
    </div>
  );
}
