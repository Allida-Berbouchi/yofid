import React from "react";

export default function ProfileCard({ data }) {
  const { name, badge, role, bio, location, website, joinedDate } = data;

  return (
    <div className="profile-card">
      <div className="profile-card-inner">
        <div className="avatar">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="18" r="10" fill="#B4B2A9" />
            <ellipse cx="24" cy="38" rx="16" ry="10" fill="#B4B2A9" />
          </svg>
          <div className="avatar-badge">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="6" fill="#1D9E75" />
              <polyline points="3,6 5,8.5 9,4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="profile-info">
          <div className="profile-name-row">
            <h1 className="profile-name">{name}</h1>
            <span className="profile-badge">{badge}</span>
          </div>
          <p className="profile-role">{role}</p>
          <p className="profile-bio">{bio}</p>
          <div className="profile-meta">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C4.79 1 3 2.79 3 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                <circle cx="7" cy="5" r="1.5" fill="currentColor"/>
              </svg>
              {location}
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                <path d="M1 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {website}
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                <line x1="1" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="4" y1="1" x2="4" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="10" y1="1" x2="10" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {joinedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
