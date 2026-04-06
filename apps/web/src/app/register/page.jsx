"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAccessToken } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
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
      
      const result = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      });

      
      if (result?.access) {
        saveAccessToken(result.access);
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="authPage">
        <section className="authShell">
          {/* LEFT: PROMO (mirrors screenshot where form on right) */}
          <div className="authRight" aria-hidden="true">
            <div className="tiltWrap left">
              <div className="tiltCard left">
                <div className="tiltNav">
                  <span>Explore</span>
                  <span>Learning Plan</span>
                  <span>Community</span>
                  <span>For Teams</span>
                </div>

                <h2 className="tiltHeadline">
                  Learn tech. <span>Build skill.</span> Grow faster.
                </h2>

                <p className="tiltText">
                  Create an account to track progress, save uploads, and access
                  your dashboard anytime.
                </p>

                <div className="tiltActions">
                  <button className="tiltBtnPrimary" type="button">
                    Start Learning
                  </button>
                  <button className="tiltBtnGhost" type="button">
                    View Paths
                  </button>
                </div>

                <div className="tiltStats">
                  <div className="stat">
                    <div className="statNum">10k+</div>
                    <div className="statLabel">Students</div>
                  </div>
                  <div className="stat">
                    <div className="statNum">500+</div>
                    <div className="statLabel">Courses</div>
                  </div>
                  <div className="stat">
                    <div className="statNum">98%</div>
                    <div className="statLabel">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="authLeft">
            <div className="authTop">
              <Link href="/" className="authLogo" aria-label="Yofid Home">
                <span className="authLogoDot" />
                <span className="authLogoText">Yofid</span>
              </Link>
            </div>

            <div className="authBody">
              <h1 className="authTitle" style={{ textAlign: "center" }}>
                Create your Account
              </h1>
              <p className="authSubtitle" style={{ textAlign: "center" }}>
                Takes less than a minute
              </p>

              {error && <div className="authError">{error}</div>}

              <form onSubmit={handleSubmit} className="authForm">
                <div className="field">
                  <label className="label" htmlFor="fullName">
                    Full name *
                  </label>
                  <input
                    id="fullName"
                    className="input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your Name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label className="label" htmlFor="email">
                    Email address *
                  </label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label className="label" htmlFor="password">
                    Password *
                  </label>
                  <input
                    id="password"
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Password"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <label className="label" htmlFor="confirm">
                    Confirm password *
                  </label>
                  <input
                    id="confirm"
                    className="input"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Rewrite your Password"
                    required
                    disabled={loading}
                  />
                </div>

                <label className="checkRow">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    disabled={loading}
                  />
                  <span>
                    I agree to the{" "}
                    <a className="linkPurple" href="#" onClick={(e) => e.preventDefault()}>
                      Terms &amp; Data Policy
                    </a>
                  </span>
                </label>

                <button className="btnPrimary" type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create account"}
                </button>

                <p className="bottomText">
                  Already have an account?{" "}
                  <Link className="linkPurple" href="/login">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      
    </>
  );
}
