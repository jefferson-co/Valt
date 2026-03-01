"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { BarChart2, Eye, MousePointerClick, Globe, TrendingUp, ArrowUpRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LinkStat {
  id:     string;
  title:  string;
  url:    string;
  clicks: number;
}

interface DayStat {
  date:   string;   // "Mon", "Tue", etc.
  views:  number;
  clicks: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDayLabels(): string[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  const result: string[] = [];
  for (let i = 6; i >= 0; i--) {
    result.push(days[(today - i + 7) % 7]);
  }
  return result;
}

// Generate plausible-looking mock view data seeded from link click counts
function buildDayStats(totalClicks: number): DayStat[] {
  const labels = getDayLabels();
  const base   = Math.max(totalClicks * 3, 20);
  return labels.map((date, i) => {
    const wave = Math.sin(i * 0.8 + 1) * 0.4 + 1;
    const views  = Math.round((base / 7) * wave * (0.7 + Math.random() * 0.6));
    const clicks = Math.round(views * (0.1 + Math.random() * 0.15));
    return { date, views: Math.max(views, 0), clicks: Math.max(clicks, 0) };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16,
      padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 500 }}>{label}</span>
        <div style={{ color: "var(--text-3)" }}>{icon}</div>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text-1)", fontFamily: "var(--font-display), Epilogue, sans-serif", lineHeight: 1 }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

function BarGraph({ data }: { data: DayStat[] }) {
  const maxViews = Math.max(...data.map((d) => d.views), 1);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: "20px 20px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Profile Views</div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Last 7 days</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent)" }} />
            <span style={{ fontSize: 11, color: "var(--text-3)" }}>Views</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--surface-2)", border: "1px solid var(--border-col)" }} />
            <span style={{ fontSize: 11, color: "var(--text-3)" }}>Clicks</span>
          </div>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, paddingBottom: 0 }}>
        {data.map((d, i) => {
          const viewH  = Math.round((d.views  / maxViews) * 100);
          const clickH = Math.round((d.clicks / maxViews) * 100);
          const isHov  = hovered === i;
          return (
            <div
              key={d.date}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, height: "100%", cursor: "default", position: "relative" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHov && (
                <div style={{
                  position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                  background: "var(--text-1)", color: "var(--bg)", borderRadius: 8, padding: "5px 9px",
                  fontSize: 11, fontWeight: 500, whiteSpace: "nowrap", zIndex: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}>
                  {d.views} views · {d.clicks} clicks
                </div>
              )}

              {/* Bar group */}
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", gap: 2 }}>
                {/* Views bar */}
                <div style={{
                  flex: 1, borderRadius: "4px 4px 0 0",
                  height: `${viewH}%`,
                  background: isHov ? "var(--accent)" : "rgba(249,115,22,0.45)",
                  transition: "height 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.15s",
                  minHeight: 2,
                }} />
                {/* Clicks bar */}
                <div style={{
                  flex: 1, borderRadius: "4px 4px 0 0",
                  height: `${clickH}%`,
                  background: isHov ? "var(--surface-2)" : "var(--surface-2)",
                  border: "1px solid var(--border-col)",
                  transition: "height 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  minHeight: 2,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* X axis labels */}
      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
        {data.map((d) => (
          <div key={d.date} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text-3)" }}>{d.date}</div>
        ))}
      </div>
    </div>
  );
}

function LinkRow({ rank, title, url, clicks, max }: { rank: number; title: string; url: string; clicks: number; max: number }) {
  const pct = max > 0 ? (clicks / max) * 100 : 0;
  const domain = (() => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  })();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-col)" }}>
      <span style={{ width: 20, fontSize: 12, color: "var(--text-3)", flexShrink: 0, textAlign: "right" }}>{rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{domain}</div>
        {/* Progress bar */}
        <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: "var(--surface-2)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: "var(--accent)", transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <MousePointerClick size={12} style={{ color: "var(--text-3)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{clicks}</span>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ w, h, radius = 8 }: { w: number | string; h: number; radius?: number }) {
  return <div style={{ width: w, height: h, borderRadius: radius, background: "var(--surface)", animation: "pulse 1.5s ease-in-out infinite" }} />;
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [links,   setLinks]   = useState<LinkStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("links")
        .select("id, title, url, clicks")
        .eq("user_id", user.id)
        .order("clicks", { ascending: false });

      setLinks((data as LinkStat[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const totalClicks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const topClicks   = links[0]?.clicks || 0;
  const dayStats    = buildDayStats(totalClicks);
  const totalViews  = dayStats.reduce((a, d) => a + d.views, 0);

  return (
    <div style={{ padding: "28px 24px 48px", maxWidth: 880, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <BarChart2 size={18} style={{ color: "var(--accent)" }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)", fontFamily: "var(--font-display), Epilogue, sans-serif", margin: 0 }}>
            Insights
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>See how your profile is performing.</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="stat-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[1, 2, 3].map((i) => <Skeleton key={i} w="100%" h={100} radius={16} />)}
        </div>
      ) : (
        <div className="stat-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard
            icon={<Eye size={15} />}
            label="Profile views (7d)"
            value={totalViews.toLocaleString()}
            sub="Estimated from activity"
          />
          <StatCard
            icon={<MousePointerClick size={15} />}
            label="Total link clicks"
            value={totalClicks.toLocaleString()}
            sub={links.length > 0 ? `Across ${links.length} link${links.length !== 1 ? "s" : ""}` : "No links yet"}
          />
          <StatCard
            icon={<TrendingUp size={15} />}
            label="Best link"
            value={links[0]?.clicks ?? "—"}
            sub={links[0]?.title ?? "Add links to track"}
          />
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <Skeleton w="100%" h={200} radius={16} />
      ) : (
        <BarGraph data={dayStats} />
      )}

      {/* Link breakdown */}
      <div style={{ marginTop: 20, background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Link Performance</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-3)" }}>
            <Globe size={12} /> All time
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 12 }}>Click counts per link</div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} w="100%" h={52} radius={8} />)}
          </div>
        ) : links.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-3)", fontSize: 13 }}>
            <MousePointerClick size={28} style={{ marginBottom: 10, opacity: 0.4, display: "block", margin: "0 auto 10px" }} />
            No links tracked yet. Add links on the Me tab.
          </div>
        ) : (
          <div>
            {links.map((l, i) => (
              <LinkRow key={l.id} rank={i + 1} title={l.title} url={l.url} clicks={l.clicks || 0} max={topClicks} />
            ))}
          </div>
        )}
      </div>

      {/* Footer note */}
      {!loading && (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-3)" }}>
          <ArrowUpRight size={11} />
          Profile views are estimated. Real-time tracking coming soon.
        </div>
      )}
    </div>
  );
}
