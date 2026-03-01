"use client";

import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
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

export default function UsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = /^[a-z0-9_-]{3,20}$/.test(username);
  const showError = username.length > 0 && !isValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (existing) {
      setError("This username is already taken.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ id: user.id, username });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
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
            Choose your username
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            This will be your public URL
          </p>
          {/* Live URL preview */}
          <p
            className="mt-3 rounded-lg px-3 py-2 text-xs"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            valt.vercel.app/
            <span className="font-medium text-white">
              {username || "your-username"}
            </span>
          </p>
        </div>

        {error && (
          <div
            className="mb-5 rounded-lg p-3 text-sm text-red-400"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            dark
            id="username"
            label="Username"
            type="text"
            placeholder="your-username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            error={
              showError
                ? "3–20 chars. Lowercase letters, numbers, hyphens, underscores."
                : undefined
            }
            required
          />
          <button
            type="submit"
            disabled={loading || !isValid}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-medium text-black transition-colors hover:bg-gray-100 disabled:opacity-40"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Claim username
          </button>
        </form>
      </div>
    </div>
  );
}
