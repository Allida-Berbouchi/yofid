"use client";
import React, { useState } from "react";

export default function SettingResource({ activeTab }) {
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [platformAnnouncements, setPlatformAnnouncements] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);

  return (
    <div className="settings-main">
      {/* Profile Information Tab */}
      {activeTab === "profile" && (
        <>
          <article className="section-card" style={{ padding: "24px" }}>
            <div className="save-row">
              <button className="save-btn">Save Changes</button>
            </div>
            <h3>Public Profile</h3>
            <p className="page-subtitle" style={{ fontSize: "16px", marginTop: "8px" }}>
              This information will be visible to other students in the community.
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
                Your identity was verified on Oct 12, 2023. You have access to professional certifications.
              </p>
            </article>
            <article className="section-card info-box">
              <h3 style={{ marginBottom: "10px" }}>System Info</h3>
              <p className="page-subtitle" style={{ fontSize: "16px" }}>USER_ID: EPR0-9928-X</p>
              <p className="page-subtitle" style={{ fontSize: "16px" }}>LAST_LOGIN: 09-09-1999 09:12</p>
              <p className="page-subtitle" style={{ fontSize: "16px" }}>IP_ADDR: 192.168.1.42</p>
            </article>
          </div>
        </>
      )}

      {/* Security and Password Tab */}
      {activeTab === "security" && (
        <article className="section-card" style={{ padding: "24px" }}>
          <div className="save-row">
            <button className="save-btn">Update Password</button>
          </div>
          <h3>Security Settings</h3>
          <p className="page-subtitle" style={{ fontSize: "16px", marginTop: "8px" }}>
            Manage your password and security preferences.
          </p>
          <div className="form-grid">
            <div className="field-full">
              <label>CURRENT PASSWORD</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="field-full">
              <label>NEW PASSWORD</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="field-full">
              <label>CONFIRM NEW PASSWORD</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <div className="field">
              <label>TWO-FACTOR AUTHENTICATION</label>
              <select defaultValue="disabled">
                <option value="disabled">Disabled</option>
                <option value="enabled">Enabled</option>
              </select>
            </div>
          </div>
        </article>
      )}

      {/* Learning Preferences Tab */}
      {activeTab === "preferences" && (
        <article className="section-card" style={{ padding: "24px" }}>
          <div className="save-row">
            <button className="save-btn">Save Preferences</button>
          </div>
          <h3>Learning Preferences</h3>
          <p className="page-subtitle" style={{ fontSize: "16px", marginTop: "8px" }}>
            Customize your learning experience.
          </p>
          <div className="pref-list">
            <div className="pref-item">
              <div>
                <h4>Weekly Digest</h4>
                <p>Summary of learning progress and new courses.</p>
              </div>
              <div>
                {weeklyDigest ? (
                  <button className="toggle on" onClick={() => setWeeklyDigest(false)} type="button">
                    ON
                  </button>
                ) : (
                  <button className="toggle off" onClick={() => setWeeklyDigest(true)} type="button">
                    OFF
                  </button>
                )}
              </div>
            </div>

            <div className="pref-item">
              <div>
                <h4>Platform Announcements</h4>
                <p>Critical updates about maintenance and new features.</p>
              </div>
              <div>
                {platformAnnouncements ? (
                  <button className="toggle on" onClick={() => setPlatformAnnouncements(false)} type="button">
                    ON
                  </button>
                ) : (
                  <button className="toggle off" onClick={() => setPlatformAnnouncements(true)} type="button">
                    OFF
                  </button>
                )}
              </div>
            </div>

            <div className="pref-item">
              <div>
                <h4>Beta Features</h4>
                <p>Try new IDE and lab environments before everyone else.</p>
              </div>
              <div>
                {betaFeatures ? (
                  <button className="toggle on" onClick={() => setBetaFeatures(false)} type="button">
                    ON
                  </button>
                ) : (
                  <button className="toggle off" onClick={() => setBetaFeatures(true)} type="button">
                    OFF
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Billing and Subscription Tab */}
      {activeTab === "billing" && (
        <article className="section-card" style={{ padding: "24px" }}>
          <div className="save-row">
            <button className="save-btn">Upgrade Plan</button>
          </div>
          <h3>Subscription Plan</h3>
          <p className="page-subtitle" style={{ fontSize: "16px", marginTop: "8px" }}>
            Manage your billing information and subscription.
          </p>
          <div className="form-grid">
            <div className="field-full">
              <label>CURRENT PLAN</label>
              <div style={{ padding: "12px", background: "#f5f5f5", borderRadius: "8px" }}>
                <strong>Free Plan</strong> - Basic features included
              </div>
            </div>
            <div className="field">
              <label>PAYMENT METHOD</label>
              <select defaultValue="none">
                <option value="none">No payment method</option>
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div className="field-full">
              <label>BILLING ADDRESS</label>
              <input type="text" placeholder="Enter billing address" />
            </div>
          </div>
        </article>
      )}
    </div>
  );
}