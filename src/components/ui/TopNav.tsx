"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TopNavProps {
  username: string;
  displayName: string | null;
}

const TABS = [
  { label: "Me",       href: "/dashboard" },
  { label: "Insights", href: "/dashboard/insights" },
  { label: "Feel",     href: "/dashboard/feel" },
];

export function TopNav({ username, displayName }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jobSearching, setJobSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = (displayName || username || "?")[0].toUpperCase();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      style={{
        height: "var(--nav-h, 56px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border-col)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 8,
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          marginRight: 20,
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect width="22" height="22" rx="5" fill="var(--text-1)" />
          <path
            d="M7 8L11 14L15 8"
            stroke="var(--bg)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="nav-logo-text"
          style={{
            fontFamily: "var(--font-display), Epilogue, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-1)",
          }}
        >
          Valt
        </span>
      </Link>

      {/* Tabs */}
      <nav style={{ display: "flex", alignItems: "stretch", height: "100%", flex: 1 }}>
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`nav-tab${isActive(tab.href) ? " active" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: isActive(tab.href) ? 600 : 400,
              color: isActive(tab.href) ? "var(--text-1)" : "var(--text-2)",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Center-right: Share + Job searching */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 8 }}>
        {/* Share */}
        <a
          href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 34,
            padding: "0 12px",
            border: "1px solid var(--border-col)",
            borderRadius: 9999,
            color: "var(--text-2)",
            background: "transparent",
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">View profile</span>
        </a>

        {/* Job searching toggle */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: 7 }}
        >
          <span style={{ fontSize: 12, color: "var(--text-2)", whiteSpace: "nowrap" }}>
            Job searching
          </span>
          <button
            onClick={() => setJobSearching(!jobSearching)}
            aria-label="Toggle job searching"
            style={{
              width: 38,
              height: 21,
              borderRadius: 10.5,
              background: jobSearching ? "var(--accent)" : "var(--surface-2)",
              border: "1px solid var(--border-col)",
              position: "relative",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 2,
                left: jobSearching ? 18 : 2,
                width: 15,
                height: 15,
                borderRadius: "50%",
                background: "white",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Right: Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* Avatar dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              height: 34,
              borderRadius: 9999,
              border: "1px solid var(--border-col)",
              padding: "0 8px 0 4px",
              background: "var(--surface-2)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "white",
              }}
            >
              {initials}
            </div>
            <ChevronDown size={12} style={{ color: "var(--text-2)" }} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 210,
                background: "var(--surface)",
                border: "1px solid var(--border-col)",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                zIndex: 100,
              }}
            >
              {/* User info */}
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid var(--border-col)",
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", margin: 0 }}>
                  {displayName || username}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-2)", margin: "2px 0 0" }}>
                  valt.app/{username}
                </p>
              </div>

              {/* Log out */}
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "var(--text-2)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
