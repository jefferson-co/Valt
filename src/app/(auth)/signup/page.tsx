"use client";

import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ValtMark() {
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill="white" />
        <path
          d="M12 13L18 23L24 13"
          stroke="#0A0A0A"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-xl font-bold text-white"
        style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
      >
        Valt
      </span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/signup/username`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/signup/username");
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ background: "#0A0A0A" }}
    >
      <ValtMark />

      <div
        className="mt-8 w-full max-w-[420px] rounded-[20px] p-10"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mb-7">
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
          >
            Create your account
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Get started with your personalized link page
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg text-sm text-white transition-colors hover:bg-white/5 disabled:opacity-50"
          style={{ border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>or</span>
          <div className="flex-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
        </div>

        {error && (
          <div
            className="mb-5 rounded-lg p-3 text-sm text-red-400"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <Input dark id="email" label="Email" type="email"
            placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <Input dark id="password" label="Password" type="password"
            placeholder="At least 6 characters" value={password}
            onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-medium text-black transition-colors hover:bg-gray-100 disabled:opacity-50"
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

        <p className="mt-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Already have an account?{" "}
          <Link href="/login" className="text-white underline underline-offset-2 hover:no-underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
