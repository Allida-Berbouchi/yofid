"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import './page.css';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms & Data Policy.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/users/register", {
        method: "POST",
        body: JSON.stringify({ name: fullName, email, password }),
      });
      router.push("/login");
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    {!visible && (
      <path
        d="M4 20 20 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    )}
  </svg>
);

  return(
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-purple-bg"></div>

        <div className="hero-card hero-card-signup">
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

      <div className="signup-right">
        <div className="signup-form-wrap">
          <div className="brand-badge">Y</div>

          <div className="signup-copy">
            <h1>Create your Account</h1>
            <p>Takes less than a minute</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Full name *</label>
              <div className="input-wrap">
                <input type="text" placeholder="Enter your Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            </div>

            <div className="field-group">
              <label>Email address *</label>
              <div className="input-wrap">
                <input type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="field-group">
              <label>Password *</label>
              <div className="input-wrap has-right-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>

              <div className="input-wrap">
                <input type="password" placeholder="Rewrite your Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
            </div>

            <label className="check-row">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>I agree to the Terms &amp; Data Policy</span>
            </label>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="switch-text">
              Already have an account ? <a href="/login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
