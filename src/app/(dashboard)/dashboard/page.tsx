"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Profile, Link as LinkType, Social } from "@/types/database";
import { ArrowUpRight, BarChart2, Eye, MousePointerClick, Globe, Pencil } from "lucide-react";

/* ─── Social icons ─── */
function XIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}
function LinkedInIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
}
function InstagramIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
}

/* ─── Social display metadata ─── */
function extractHandle(platform: string, url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (platform === "linkedin") {
      const inIdx = parts.indexOf("in");
      return inIdx !== -1 && parts[inIdx + 1] ? parts[inIdx + 1] : parts[0] ?? url;
    }
    const handle = parts[0] ?? "";
    return handle ? (handle.startsWith("@") ? handle : "@" + handle) : url;
  } catch {
    return url;
  }
}

const SOCIAL_META: Record<string, { label: string; icon: React.ReactNode }> = {
  x:         { label: "X (twitter)",  icon: <XIcon /> },
  linkedin:  { label: "LinkedIn",     icon: <LinkedInIcon /> },
  instagram: { label: "Instagram",    icon: <InstagramIcon /> },
};

/* ─── Analytics helpers (matches Insights page) ─── */
interface DayStat { date: string; views: number; clicks: number; }

function getDayLabels(): string[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, i) => days[(today - (6 - i) + 7) % 7]);
}

function buildDayStats(totalClicks: number): DayStat[] {
  const labels = getDayLabels();
  const base = Math.max(totalClicks * 3, 20);
  return labels.map((date, i) => {
    const wave = Math.sin(i * 0.8 + 1) * 0.4 + 1;
    const views  = Math.round((base / 7) * wave * (0.7 + Math.random() * 0.6));
    const clicks = Math.round(views * (0.1 + Math.random() * 0.15));
    return { date, views: Math.max(views, 0), clicks: Math.max(clicks, 0) };
  });
}

/* ─── Mini bar chart ─── */
function MiniChart({ data }: { data: DayStat[] }) {
  const maxViews = Math.max(...data.map((d) => d.views), 1);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 90 }}>
        {data.map((d, i) => {
          const h = Math.max(Math.round((d.views / maxViews) * 100), 2);
          const isHov = hovered === i;
          return (
            <div
              key={d.date}
              style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", cursor: "default", position: "relative" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHov && (
                <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", background: "var(--text-1)", color: "var(--bg)", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 500, whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
                  {d.views} views
                </div>
              )}
              <div style={{ width: "100%", borderRadius: "3px 3px 0 0", height: `${h}%`, background: isHov ? "var(--accent)" : "rgba(249,115,22,0.38)", transition: "background 0.15s, height 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
        {data.map((d) => (
          <div key={d.date} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "var(--text-3)" }}>{d.date}</div>
        ))}
      </div>
    </div>
  );
}

/* ─── Contact icon ─── */
function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ─── Main ─── */
export default function MePage() {
  const [profile,   setProfile]   = useState<Partial<Profile>>({});
  const [links,     setLinks]     = useState<LinkType[]>([]);
  const [socials,   setSocials]   = useState<Social[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loaded,    setLoaded]    = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserEmail(user.email ?? null);
      const [p, l, s] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("links").select("*").eq("user_id", user.id).order("position"),
        supabase.from("socials").select("*").eq("user_id", user.id),
      ]);
      if (p.data) setProfile(p.data as Profile);
      if (l.data) setLinks(l.data as LinkType[]);
      if (s.data) setSocials(s.data as Social[]);
      setLoaded(true);
    }
    load();
  }, []);

  const activeLinks  = links.filter((l) => l.is_active);
  const totalClicks  = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const topClicks    = links[0]?.clicks || 0;
  const dayStats     = buildDayStats(totalClicks);
  const totalViews   = dayStats.reduce((a, d) => a + d.views, 0);
  const name         = profile.display_name ?? profile.username ?? "Your Name";
  const hasContent   = profile.bio || socials.length > 0 || activeLinks.length > 0;

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - var(--nav-h, 56px))" }}>
        <svg className="animate-spin" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="var(--text-3)" strokeWidth="3" />
          <path className="opacity-75" fill="var(--text-3)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="dash-outer" style={{ display: "flex", height: "calc(100vh - var(--nav-h, 56px))", overflow: "hidden" }}>

      {/* ── Left: Profile content ── */}
      <div className="dash-left" style={{ flex: 1, overflowY: "auto", padding: "36px 40px 64px", borderRight: "1px solid var(--border-col)" }}>

        {/* Avatar + Name + Edit button */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 24 }}>
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt={name} style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            : <div style={{ width: 68, height: 68, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "white", flexShrink: 0 }}>{name[0]?.toUpperCase()}</div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontFamily: "var(--font-display), Epilogue, sans-serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(22px, 3vw, 32px)",
              color: "var(--text-1)",
              margin: 0,
              lineHeight: 1.1,
            }}>
              {name}
            </h1>
            <p style={{ fontSize: 12, color: "var(--text-3)", margin: "4px 0 0" }}>@{profile.username}</p>
          </div>
          <Link
            href="/dashboard/feel"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              height: 32, padding: "0 14px", borderRadius: 9999,
              border: "1px solid var(--border-col)", background: "var(--surface)",
              color: "var(--text-2)", fontSize: 12, fontWeight: 500,
              textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap",
            }}
          >
            <Pencil size={11} /> Edit profile
          </Link>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div style={{ padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 12, marginBottom: 28 }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-2)", margin: 0 }}>{profile.bio}</p>
          </div>
        )}

        {/* Contact section */}
        {(socials.length > 0 || userEmail) && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ color: "var(--accent)", display: "flex" }}><PhoneIcon /></span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>Contact</span>
            </div>
            {userEmail && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--border-col)" }}>
                <span style={{ fontSize: 14, color: "var(--text-2)" }}>Email</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, color: "var(--text-1)" }}>{userEmail}</span>
                  <ArrowUpRight size={12} style={{ color: "var(--text-3)" }} />
                </div>
              </div>
            )}
            {socials.map((s) => {
              const meta = SOCIAL_META[s.platform];
              const handle = extractHandle(s.platform, s.url);
              return (
                <div key={s.platform} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--border-col)" }}>
                  <span style={{ fontSize: 14, color: "var(--text-2)" }}>{meta?.label}</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                    <span style={{ fontSize: 14, color: "var(--text-1)" }}>{handle}</span>
                    <ArrowUpRight size={12} style={{ color: "var(--text-3)" }} />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Links section */}
        {activeLinks.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ color: "var(--accent)", display: "flex" }}><LinkIcon /></span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>Links</span>
            </div>
            {activeLinks.map((link) => {
              let domain = link.url;
              try { domain = new URL(link.url).hostname.replace("www.", ""); } catch { /* ignore */ }
              return (
                <div key={link.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--border-col)" }}>
                  <span style={{ fontSize: 14, color: "var(--text-2)" }}>{link.title}</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>{domain}</span>
                    <ArrowUpRight size={12} style={{ color: "var(--text-3)" }} />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!hasContent && (
          <div style={{ paddingTop: 56, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20 }}>
              Your profile is empty. Start building it in the Feel tab.
            </p>
            <Link
              href="/dashboard/feel"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 38, padding: "0 20px", borderRadius: 9999, background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
            >
              <Pencil size={13} /> Edit Profile
            </Link>
          </div>
        )}
      </div>

      {/* ── Right: Mini insights ── */}
      <div className="dash-right" style={{ width: 316, flexShrink: 0, overflowY: "auto", padding: "24px 18px 48px" }}>

        {/* Last 7 days chart */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: "16px 16px 14px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Last 7 days</span>
            <Link
              href="/dashboard/insights"
              style={{ fontSize: 11, color: "var(--text-2)", textDecoration: "none", border: "1px solid var(--border-col)", borderRadius: 9999, padding: "4px 10px", background: "var(--surface-2)", whiteSpace: "nowrap" }}
            >
              Open Insight
            </Link>
          </div>
          <MiniChart data={dayStats} />
        </div>

        {/* Quick stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 12, padding: "14px 14px" }}>
            <p style={{ fontSize: 10, color: "var(--text-3)", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
              <Eye size={10} /> Page views
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", margin: 0, fontFamily: "var(--font-display), Epilogue, sans-serif", lineHeight: 1 }}>
              {totalViews.toLocaleString()}
            </p>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 12, padding: "14px 14px" }}>
            <p style={{ fontSize: 10, color: "var(--text-3)", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
              <MousePointerClick size={10} /> Total clicks
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", margin: 0, fontFamily: "var(--font-display), Epilogue, sans-serif", lineHeight: 1 }}>
              {totalClicks.toLocaleString()}
            </p>
          </div>
        </div>

        {/* All time divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border-col)" }} />
          <span style={{ fontSize: 10, color: "var(--text-3)", whiteSpace: "nowrap" }}>All time data</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-col)" }} />
        </div>

        {/* All-time 2×2 grid */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, overflow: "hidden", marginBottom: 10 }}>
          {[
            [
              { icon: <Eye size={10} />,              label: "Page views",   value: totalViews.toLocaleString() },
              { icon: <MousePointerClick size={10} />, label: "Total clicks", value: totalClicks.toLocaleString() },
            ],
            [
              { icon: <Globe size={10} />,    label: "Countries", value: "—" },
              { icon: <BarChart2 size={10} />, label: "Avg time",  value: "—" },
            ],
          ].map((row, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: ri === 0 ? "1px solid var(--border-col)" : "none" }}>
              {row.map((stat, ci) => (
                <div key={stat.label} style={{ padding: "14px 14px", borderRight: ci === 0 ? "1px solid var(--border-col)" : "none" }}>
                  <p style={{ fontSize: 10, color: "var(--text-3)", margin: "0 0 5px", display: "flex", alignItems: "center", gap: 4 }}>
                    {stat.icon} {stat.label}
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)", margin: 0, fontFamily: "var(--font-display), Epilogue, sans-serif", lineHeight: 1 }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Top links */}
        {links.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>
              Top links
            </p>
            {links.slice(0, 5).map((link) => {
              const pct = topClicks > 0 ? ((link.clicks || 0) / topClicks) * 100 : 0;
              return (
                <div key={link.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{link.title}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)", flexShrink: 0, marginLeft: 8 }}>{link.clicks || 0}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: "var(--surface-2)" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: "var(--accent)", transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
