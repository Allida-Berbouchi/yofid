"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAccessToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveAccessToken(result.access);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="authPage">
        <section className="authShell">
          {/* LEFT: FORM */}
          <div className="authLeft">
            <div className="authTop">
              <Link href="/" className="authLogo" aria-label="Yofid Home">
                <span className="authLogoDot" />
                <span className="authLogoText">Yofid</span>
              </Link>
            </div>

            <div className="authBody">
              <h1 className="authTitle">Welcome Back !</h1>
              <p className="authSubtitle">Sign in to your account.</p>

              {error && <div className="authError">{error}</div>}

              <form onSubmit={handleSubmit} className="authForm">
                <div className="field">
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="field">
                  <div className="labelRow">
                    <label className="label" htmlFor="password">
                      Password
                    </label>
                    <Link className="linkMuted" href="/forgot-password">
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    disabled={loading}
                  />
                </div>

                <button className="btnPrimary" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="divider">
                  <span>OR</span>
                </div>

                <button
                  className="btnGoogle"
                  type="button"
                  disabled={loading}
                  onClick={() => setError("Google login not wired yet.")}
                >
                  <span className="gIcon">G</span>
                  Continue with Google
                </button>

                <p className="bottomText">
                  Don't have an account?{" "}
                  <Link className="linkPurple" href="/register">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT: PROMO */}
          <div className="authRight" aria-hidden="true">
            <div className="tiltWrap">
              <div className="tiltCard">
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
                  The modern learning platform for developers. Master high-demand
                  skills with guided paths, projects, and community support.
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
        </section>
      </main>

      
    </>
  );
}

