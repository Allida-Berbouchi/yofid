"use client";
import React from "react";
import "./page.css";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { saveAccessToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from 'next/image';

const MailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 6.5h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a1 1 0 0 1 1-1Z"
      fill="currentColor"
      opacity="0.15"
    />
    <path
      d="M4 7.5 12 13l8-5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="3"
      y="6"
      width="18"
      height="12"
      rx="2.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <rect
      x="4"
      y="10"
      width="16"
      height="10"
      rx="2.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="15" r="1.2" fill="currentColor" />
    <path
      d="M12 16.2v1.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5Z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7 12.9 19c1.8-4.4 6.2-7 11.1-7 3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.4-8l-6.5 5C9.4 39.5 16.1 44 24 44Z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C37 38.5 44 34 44 24c0-1.2-.1-2.4-.4-3.5Z"
    />
  </svg>
);



const Sign = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const result = await apiFetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!result.ok) {
      setError(result.data?.message || "Login failed");
      return;
    }
    const { token, user } = result.data;
    saveAccessToken(token);
    localStorage.setItem("name", user.name);
    localStorage.setItem("role", user.role);
    localStorage.setItem("email", user.email);
    localStorage.setItem("id", user._id.toString());
    localStorage.setItem("level", user.level);
    localStorage.setItem("creator", String(Boolean(user.creator)));

    console.log(`the local storage ${localStorage.getItem("name")}`);
    if (user.role === "admin") {
      router.push("/Settings");
    } else {
      router.push("/dashboard");
    }
  } catch (err) {
    setError(err?.message || "Login failed");
  }
};

  return (
    
    <div className="signin-page">
      <div className="signin-left">
        <div className="signin-form-wrap">
            <span className="Youfid">
                <Image src="icon.svg" alt="My Icon" 
                    width={88} 
                    height={88} 
                  />
                  <p>Youfid</p>
              </span>

          <div className="signin-copy">
            <h1>Welcome Back !</h1>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <LockIcon />
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="forgot-row">
                <a href="/">Forget Password?</a>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="primary-btn">Sign in</button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button type="button" className="google-btn">
              <span className="google-icon">
                <GoogleIcon />
              </span>
              Continue with Google
            </button>

            <p className="switch-text">
              Don&apos;t have an account? <a href="/register">Sign up</a>
            </p>
          </form>
        </div>
      </div>

      <div className="signin-right">
        <div className="signin-purple-bg"></div>

        <div className="hero-card hero-card-login">
          <div className="hero-nav">
            <span>Explore</span>
            <span>Learning Paths</span>
            <span>Contributors</span>
            <span>For Teams</span>
          </div>

          <div className="hero-body">
            <h2>
              Learn tech. <span>Build</span>
              <br />
              <span>skill.</span> Grow faster.
            </h2>

            <p>
              The mobile-first training platform for modern engineers. Master
              high-demand technologies through bite-sized, interactive learning
              paths designed for your daily commute.
            </p>

            <div className="hero-actions">
              <button className="cta-primary">Start Learning</button>
              <button className="cta-secondary">View Paths</button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h3>10k+</h3>
              <p>Active Learners</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Expert Courses</p>
            </div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>User Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;
