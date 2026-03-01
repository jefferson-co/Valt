"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useState } from "react";

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

export default function EntryPage() {
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Logo */}
      <div className="entry-logo" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <svg width="52" height="52" viewBox="0 0 22 22" fill="none">
          <rect width="22" height="22" rx="6" fill="var(--text-1)" />
          <path
            d="M7 8L11 14L15 8"
            stroke="var(--bg)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-display), Epilogue, sans-serif",
            fontWeight: 800,
            fontSize: 19,
            color: "var(--text-1)",
            letterSpacing: "-0.3px",
          }}
        >
          Valt
        </span>
      </div>

      {/* Headline */}
      <div className="entry-text" style={{ textAlign: "center", padding: "0 24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display), Epilogue, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(26px, 5vw, 44px)",
            lineHeight: 1.08,
            color: "var(--text-1)",
            margin: 0,
          }}
        >
          Showcase{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>you</em>{" "}
          with style.
        </h1>
        <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.6, marginTop: 12 }}>
          Your links, your story — all in one place.
        </p>
      </div>

      {/* Buttons */}
      <div
        className="entry-btns"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 36,
          width: "min(100%, 340px)",
          padding: "0 24px",
        }}
      >
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            height: 50,
            borderRadius: 9999,
            background: "#F97316",
            border: "none",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: googleLoading ? "not-allowed" : "pointer",
            opacity: googleLoading ? 0.7 : 1,
            width: "100%",
          }}
        >
          {googleLoading ? (
            <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        <Link
          href="/login"
          style={{
            height: 50,
            borderRadius: 9999,
            background: "rgba(249, 115, 22, 0.5)",
            border: "none",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            width: "100%",
          }}
        >
          <Mail size={17} />
          Continue with Email
        </Link>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
          Free forever · No credit card required
        </p>
      </div>

      {/* Footer */}
      <p style={{ position: "absolute", bottom: 20, fontSize: 12, color: "var(--text-3)" }}>
        © 2025 Valt &nbsp;·&nbsp;
        <a href="#" style={{ color: "var(--text-3)", textDecoration: "none" }}>
          Terms of Service
        </a>
      </p>
    </div>
  );
}
