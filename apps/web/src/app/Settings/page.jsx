"use client";
import SettingResource from "@/components/SettingResource";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile"); // Track active tab

  return (
    <AppLayout>
      <Topbar settingsActive />
      <div className="page-shell">
        <section className="page-head">
          <h1 className="page-title">Account Settings</h1>
          <p className="page-subtitle">
            Manage your learning experience, security credentials, and
            subscription preferences from one central interface.
          </p>
        </section>

        <section className="settings-layout">
          <aside className="settings-tabs section-card">
            <div className="tab-list">
              <div 
                className={`tab-link ${activeTab === "profile" ? "active" : ""}`} 
                onClick={() => setActiveTab("profile")}
              >
                Profile Information
              </div>
              <div 
                className={`tab-link ${activeTab === "security" ? "active" : ""}`} 
                onClick={() => setActiveTab("security")}
              >
                Security and Password
              </div>
              <div 
                className={`tab-link ${activeTab === "preferences" ? "active" : ""}`} 
                onClick={() => setActiveTab("preferences")}
              >
                Learning Preferences
              </div>
              <div 
                className={`tab-link ${activeTab === "billing" ? "active" : ""}`} 
                onClick={() => setActiveTab("billing")}
              >
                Billing and Subscription
              </div>
              <div 
                className="tab-link" 
                onClick={() => router.push("/user-management")}
              >
                User Management
              </div>
              <div className="tab-link" style={{ color: "#d73d32" }}>
                <button 
                  className="my-button" 
                  onClick={() => {
                    console.log("signed out");
                    router.push("/login");
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          <SettingResource activeTab={activeTab} />
        </section>
      </div>
    </AppLayout>
  );
}