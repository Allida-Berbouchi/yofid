"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";

export default function SettingsPage() {
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [platformAnnouncements, setPlatformAnnouncements] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);

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
              <div className="tab-link active">Profile Information</div>
              <div className="tab-link">Security and Password</div>
              <div className="tab-link">Learning Preferences</div>
              <div className="tab-link">Billing and Subscription</div>
              <div className="tab-link" style={{ color: "#d73d32" }}>Sign Out</div>
            </div>
          </aside>

          <div className="settings-main">
            <article className="section-card" style={{ padding: "24px" }}>
              <div className="save-row">
                <button className="save-btn">Save Changes</button>
              </div>
              <h3>Public Profile</h3>
              <p className="page-subtitle" style={{ fontSize: "16px", marginTop: "8px" }}>
                This information will be visible to other students in the
                community.
              </p>
              <div className="form-grid">
                <div className="field">
                  <label>FULL NAME</label>
                  <input type="text" placeholder="Allida" />
                </div>
                <div className="field">
                  <label>EMAIL ADDRESS</label>
                  <input type="email" placeholder="allida@youfid.dev" />
                </div>
                <div className="field-full">
                  <label>PROFESSIONAL BIO</label>
                  <textarea placeholder="Tell others about your experience and technical focus." />
                </div>
                <div className="field">
                  <label>TIMEZONE</label>
                  <select defaultValue="utc1">
                    <option value="utc1">UTC +01:00</option>
                    <option value="utc0">UTC +00:00</option>
                    <option value="utc2">UTC +02:00</option>
                  </select>
                </div>
              </div>
            </article>

            <div className="info-grid" style={{ marginTop: "18px" }}>
              <article className="section-card info-box" style={{ background: "#edf7f3" }}>
                <h3 style={{ color: "#177867", marginBottom: "10px" }}>Verified Learner</h3>
                <p className="page-subtitle" style={{ fontSize: "16px" }}>
                  Your identity was verified on Oct 12, 2023. You have access to
                  professional certifications.
                </p>
              </article>
              <article className="section-card info-box">
                <h3 style={{ marginBottom: "10px" }}>System Info</h3>
                <p className="page-subtitle" style={{ fontSize: "16px" }}>USER_ID: EPR0-9928-X</p>
                <p className="page-subtitle" style={{ fontSize: "16px" }}>LAST_LOGIN: 09-09-1999 09:12</p>
                <p className="page-subtitle" style={{ fontSize: "16px" }}>IP_ADDR: 192.168.1.42</p>
              </article>
            </div>

            <article className="section-card" style={{ padding: "24px" }}>
              <h3>Learning Preferences</h3>
              <div className="pref-list">
                <div className="pref-item">
                  <div>
                    <h4>Weekly Digest</h4>
                    <p>Summary of learning progress and new courses.</p>
                  </div>
                  <button className={`toggle ${weeklyDigest ? "on" : ""}`} onClick={() => setWeeklyDigest((prev) => !prev)} type="button" aria-label="Toggle weekly digest" />
                </div>
                <div className="pref-item">
                  <div>
                    <h4>Platform Announcements</h4>
                    <p>Critical updates about maintenance and new features.</p>
                  </div>
                  <button className={`toggle ${platformAnnouncements ? "on" : ""}`} onClick={() => setPlatformAnnouncements((prev) => !prev)} type="button" aria-label="Toggle platform announcements" />
                </div>
                <div className="pref-item">
                  <div>
                    <h4>Beta Features</h4>
                    <p>Try new IDE and lab environments before everyone else.</p>
                  </div>
                  <button className={`toggle ${betaFeatures ? "on" : ""}`} onClick={() => setBetaFeatures((prev) => !prev)} type="button" aria-label="Toggle beta features" />
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
