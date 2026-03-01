"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

/* ─── Shared icons ─── */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ─── Left panel — CSS-only geometric background ─── */

function LeftPanel({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div className="relative hidden h-screen flex-col md:flex" style={{ width: "55%" }}>
      {/* Base layer */}
      <div className="absolute inset-0" style={{ background: "#08121E" }} />

      {/* Geometric panes */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(148deg, #122444 0%, #0a1b30 70%)",
          clipPath: "polygon(0 0, 62% 0, 42% 100%, 0 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(118deg, #0e1f38 0%, #1a3358 55%, #0c1c31 100%)",
          clipPath: "polygon(58% 0, 100% 0, 100% 100%, 34% 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(165deg, #1b3660 0%, transparent 55%)",
          clipPath: "polygon(0 0, 35% 0, 20% 42%, 0 30%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(30deg, #0d2240 0%, transparent 50%)",
          clipPath: "polygon(15% 100%, 50% 58%, 72% 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(200deg, #102035 0%, transparent 60%)",
          clipPath: "polygon(38% 0, 65% 0, 52% 38%, 28% 22%)",
        }}
      />

      {/* Edge-highlight lines */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: "41%",
          width: "1px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(100,160,230,0.18) 25%, rgba(140,190,255,0.25) 60%, transparent 100%)",
          transform: "skewX(-1deg)",
        }}
      />
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: "60%",
          width: "1px",
          background: "linear-gradient(to bottom, rgba(100,160,230,0.12) 0%, rgba(100,160,230,0.08) 50%, transparent 100%)",
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          top: "38%",
          height: "1px",
          background: "linear-gradient(to right, transparent 0%, rgba(100,160,230,0.1) 30%, rgba(140,190,255,0.18) 65%, transparent 100%)",
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Depth vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 25% 55%, transparent 25%, rgba(4,10,18,0.65) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-9">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="5" fill="white" />
              <path d="M7 8L11 14L15 8" stroke="#08121E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className="text-[17px] font-bold text-white"
              style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
            >
              Valt
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.45)" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          >
            <ArrowLeft size={13} />
            Back to Website
          </Link>
        </div>

        <div className="flex-1" />

        {/* Hero text */}
        <div>
          <h1
            className="font-bold leading-[1.08] text-white"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontSize: "clamp(30px, 3.5vw, 50px)",
              whiteSpace: "pre-line",
            }}
          >
            {headline}
          </h1>
          <p
            className="mt-4 max-w-[340px] text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.42)" }}
          >
            {sub}
          </p>
          <div
            className="mt-8 rounded-full"
            style={{ width: 28, height: 2.5, background: "rgba(255,255,255,0.4)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Signup page ─── */

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/signup/username`,
        },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.session) {
        // Email confirmation is off — session created immediately
        window.location.href = "/signup/username";
      } else {
        // Email confirmation is on — ask user to check inbox
        setEmailSent(true);
        setLoading(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Signup error:", msg);
      setError(msg.includes("Missing Supabase") ? "App not configured — env vars missing on Vercel." : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) { setGoogleLoading(false); }
    } catch {
      setGoogleLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-4"
        style={{ background: "var(--bg)", fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}
      >
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            background: "var(--surface)",
            border: "1px solid var(--border-col)",
            borderRadius: 20,
            padding: "48px 40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", margin: "0 0 10px", fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}>
            Check your email
          </h1>
          <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
            We sent a confirmation link to <strong style={{ color: "var(--text-1)" }}>{email}</strong>.
            Click it to confirm your account, then come back and log in.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-block",
              height: 46,
              lineHeight: "46px",
              borderRadius: 9999,
              background: "var(--accent)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              padding: "0 28px",
            }}
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}
    >
      {/* Left panel */}
      <LeftPanel
        headline={"Join Thousands\nof Creators."}
        sub="Build your link-in-bio in minutes. Customize every detail and share everything that matters in one link."
      />

      {/* Right panel */}
      <div
        className="flex min-h-screen flex-1 flex-col justify-center overflow-y-auto"
        style={{ padding: "48px clamp(28px, 7vw, 80px)", background: "var(--bg)" }}
      >
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 md:hidden">
          <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="5" fill="white" />
            <path d="M7 8L11 14L15 8" stroke="#0A0A0A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-[17px] font-bold"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--text-1)" }}
          >
            Valt
          </span>
        </div>

        <div style={{ maxWidth: 400, width: "100%" }}>
          {/* Heading */}
          <h1
            className="font-bold"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontSize: 30,
              margin: "0 0 6px",
              color: "var(--text-1)",
            }}
          >
            Create your account
          </h1>
          <p className="mb-7 text-sm" style={{ color: "var(--text-2)" }}>
            Get started with your personalized link page.
          </p>

          {/* Error */}
          {error && (
            <div
              className="mb-5 rounded-xl p-3 text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-2)" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Input your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 10,
                  border: "1.5px solid var(--border-col)",
                  background: "var(--surface-2)",
                  padding: "0 14px",
                  fontSize: 14,
                  color: "var(--text-1)",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-col)")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-2)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 10,
                    border: "1.5px solid var(--border-col)",
                    background: "var(--surface-2)",
                    padding: "0 44px 0 14px",
                    fontSize: 14,
                    color: "var(--text-1)",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-col)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 0, display: "flex" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 font-semibold text-white transition-opacity disabled:opacity-60"
              style={{
                height: 50,
                borderRadius: 9999,
                background: "var(--accent)",
                border: "none",
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseOver={(e) => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Create account
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: "var(--border-col)" }} />
            <span className="text-xs" style={{ color: "var(--text-3)" }}>Or continue with</span>
            <div className="h-px flex-1" style={{ background: "var(--border-col)" }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-2.5 font-medium transition-colors disabled:opacity-60"
            style={{
              height: 50,
              borderRadius: 10,
              border: "1.5px solid var(--border-col)",
              background: "var(--surface-2)",
              fontSize: 14,
              color: "var(--text-1)",
              cursor: googleLoading ? "not-allowed" : "pointer",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border-col)"; }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Log in link */}
          <p className="mt-7 text-center text-sm" style={{ color: "var(--text-2)" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold transition-colors"
              style={{ color: "var(--accent)", textDecoration: "none" }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
