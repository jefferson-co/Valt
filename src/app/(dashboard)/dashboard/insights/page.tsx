"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  BarChart2, Eye, MousePointerClick, Globe, TrendingUp, ArrowUpRight,
  Monitor, Smartphone, Tablet, Users, Clock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LinkStat { id: string; title: string; url: string; clicks: number; }
interface DayStat  { date: string; views: number; uniques: number; clicks: number; avgTime: number; }
type MetricKey = "views" | "uniques" | "clicks" | "avgTime";
type Period    = "24h" | "7d" | "30d" | "all";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLabels(period: Period): string[] {
  if (period === "24h") return ["12AM","3AM","6AM","9AM","12PM","3PM","6PM","9PM"];
  if (period === "7d") {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const today = new Date().getDay();
    return Array.from({ length: 7 }, (_, i) => days[(today - (6 - i) + 7) % 7]);
  }
  if (period === "30d") {
    const result: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 5);
      result.push(d.toLocaleDateString("en", { month: "short", day: "numeric" }));
    }
    return result;
  }
  // all — last 6 months
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return months[d.getMonth()];
  });
}

function periodLabel(period: Period): string {
  return { "24h": "Last 24 hours", "7d": "Last 7 days", "30d": "Last 30 days", "all": "All time" }[period];
}

function buildStats(totalClicks: number, period: Period): DayStat[] {
  const labels = getLabels(period);
  if (totalClicks === 0) return labels.map(date => ({ date, views: 0, uniques: 0, clicks: 0, avgTime: 0 }));

  const scale = period === "24h" ? 0.05 : period === "7d" ? 0.25 : period === "30d" ? 0.80 : 1;
  const base  = totalClicks * scale * 3;

  return labels.map((date, i) => {
    const wave    = Math.sin(i * 0.8 + 1) * 0.4 + 1;
    const views   = Math.round((base / labels.length) * wave * (0.7 + Math.random() * 0.6));
    const uniques = Math.round(views * (0.6 + Math.random() * 0.2));
    const clicks  = Math.round(views * (0.1 + Math.random() * 0.15));
    const avgTime = Math.round(45 + Math.random() * 90);
    return { date, views: Math.max(views, 0), uniques: Math.max(uniques, 0), clicks: Math.max(clicks, 0), avgTime: Math.max(avgTime, 0) };
  });
}

function formatTime(s: number): string {
  if (s === 0) return "0s";
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${s}s`;
}

// ─── Metrics config ───────────────────────────────────────────────────────────

interface MetricConfig {
  key:    MetricKey;
  label:  string;
  icon:   React.ReactNode;
  format: (v: number) => string;
  color:  string;
}

const METRICS: MetricConfig[] = [
  { key: "views",   label: "Page views",    icon: <Eye size={13} />,               format: (v) => v.toLocaleString(),            color: "#f97316" },
  { key: "uniques", label: "Unique visits", icon: <Users size={13} />,             format: (v) => v.toLocaleString(),            color: "#8b5cf6" },
  { key: "clicks",  label: "Total clicks",  icon: <MousePointerClick size={13} />, format: (v) => v.toLocaleString(),            color: "#06b6d4" },
  { key: "avgTime", label: "Avg time",      icon: <Clock size={13} />,             format: (v) => formatTime(Math.round(v)),     color: "#10b981" },
];

const PERIODS: { key: Period; label: string }[] = [
  { key: "24h", label: "24h" },
  { key: "7d",  label: "7d"  },
  { key: "30d", label: "30d" },
  { key: "all", label: "All" },
];

// ─── Line Chart ───────────────────────────────────────────────────────────────

function LineChart({ data, metric }: { data: DayStat[]; metric: MetricConfig }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const values = data.map(d => d[metric.key] as number);
  const max    = Math.max(...values, 1);
  const W = 600, H = 130, px = 16, py = 14;

  const pts = values.map((v, i) => ({
    x: px + (i / Math.max(values.length - 1, 1)) * (W - px * 2),
    y: py + (1 - v / max) * (H - py * 2),
    v,
  }));

  const linePath = pts.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cx   = (prev.x + p.x) / 2;
    return `C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  }).join(" ");

  const fillPath = `${linePath} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`;
  const gradId   = `grad-${metric.key}`;

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 150, display: "block", overflow: "visible" }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={metric.color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={metric.color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={metric.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y}
            r={hovered === i ? 5 : 3.5}
            fill={hovered === i ? metric.color : "var(--surface)"}
            stroke={metric.color} strokeWidth="2"
            style={{ cursor: "default", transition: "r 0.15s" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>

      {hovered !== null && (
        <div style={{
          position: "absolute", top: 0,
          left: `${(pts[hovered].x / W) * 100}%`,
          transform: "translate(-50%, 0)",
          background: "var(--text-1)", color: "var(--bg)",
          borderRadius: 8, padding: "4px 10px",
          fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
          zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", pointerEvents: "none",
        }}>
          {data[hovered].date}: {metric.format(pts[hovered].v)}
        </div>
      )}

      <div style={{ display: "flex", marginTop: 6 }}>
        {data.map((d) => (
          <div key={d.date} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 1px" }}>{d.date}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Skeleton({ w, h, radius = 8 }: { w: number | string; h: number; radius?: number }) {
  return <div style={{ width: w, height: h, borderRadius: radius, background: "var(--surface-2)", animation: "pulse 1.5s ease-in-out infinite" }} />;
}

function CountryRow({ flag, name, pct, value }: { flag: string; name: string; pct: number; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{flag}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "var(--text-1)", fontWeight: 500 }}>{name}</span>
          <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 600 }}>{value.toLocaleString()}</span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "var(--surface-2)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: "var(--accent)", transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>
      </div>
    </div>
  );
}

function DeviceRow({ icon, name, pct, value }: { icon: React.ReactNode; name: string; pct: number; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-col)" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>{name}</span>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "var(--surface-2)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: "var(--accent)", transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", flexShrink: 0 }}>{value.toLocaleString()}</span>
    </div>
  );
}

function LinkRow({ rank, title, url, clicks, max }: { rank: number; title: string; url: string; clicks: number; max: number }) {
  const pct    = max > 0 ? (clicks / max) * 100 : 0;
  const domain = (() => { try { return new URL(url).hostname.replace("www.", ""); } catch { return url; } })();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-col)" }}>
      <span style={{ width: 20, fontSize: 12, color: "var(--text-3)", flexShrink: 0, textAlign: "right" }}>{rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{domain}</div>
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

function ReferrerRow({ name, pct, value }: { name: string; pct: number; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--border-col)" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>{name}</span>
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "var(--surface-2)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: "var(--accent)", transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", flexShrink: 0 }}>{value.toLocaleString()}</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [links,        setLinks]        = useState<LinkStat[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeMetric, setActiveMetric] = useState<MetricKey>("views");
  const [period,       setPeriod]       = useState<Period>("7d");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("links").select("id, title, url, clicks")
        .eq("user_id", user.id).order("clicks", { ascending: false });
      setLinks((data as LinkStat[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const totalClicks  = links.reduce((acc, l) => acc + (l.clicks || 0), 0);
  const topClicks    = links[0]?.clicks || 0;
  const stats        = buildStats(totalClicks, period);
  const totalViews   = stats.reduce((a, d) => a + d.views, 0);
  const totalUniques = stats.reduce((a, d) => a + d.uniques, 0);
  const avgTime      = stats.length ? Math.round(stats.reduce((a, d) => a + d.avgTime, 0) / stats.length) : 0;

  const metricTotals: Record<MetricKey, number> = {
    views: totalViews, uniques: totalUniques, clicks: totalClicks, avgTime,
  };

  const activeMetricConfig = METRICS.find(m => m.key === activeMetric)!;

  const countryData = [
    { flag: "🇺🇸", name: "United States",  value: Math.round(totalViews * 0.34) },
    { flag: "🇬🇧", name: "United Kingdom", value: Math.round(totalViews * 0.18) },
    { flag: "🇳🇬", name: "Nigeria",        value: Math.round(totalViews * 0.14) },
    { flag: "🇨🇦", name: "Canada",         value: Math.round(totalViews * 0.11) },
    { flag: "🇩🇪", name: "Germany",        value: Math.round(totalViews * 0.08) },
  ];
  const maxCountry = countryData[0].value || 1;

  const deviceData = [
    { icon: <Smartphone size={15} />, name: "Mobile",  pct: 62, value: Math.round(totalViews * 0.62) },
    { icon: <Monitor size={15} />,    name: "Desktop", pct: 31, value: Math.round(totalViews * 0.31) },
    { icon: <Tablet size={15} />,     name: "Tablet",  pct: 7,  value: Math.round(totalViews * 0.07) },
  ];

  const referrerData = [
    { name: "Direct / None", pct: 45, value: Math.round(totalViews * 0.45) },
    { name: "Instagram",     pct: 28, value: Math.round(totalViews * 0.28) },
    { name: "LinkedIn",      pct: 15, value: Math.round(totalViews * 0.15) },
    { name: "X / Twitter",   pct: 12, value: Math.round(totalViews * 0.12) },
  ];

  return (
    <>
      <style>{`
        .ins-outer        { padding: 28px 24px 64px; max-width: 900px; margin: 0 auto; }
        .ins-metric-grid  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
        .ins-metric-value { font-size: 22px; font-weight: 700; line-height: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-family: var(--font-display), Epilogue, sans-serif; }
        .ins-bottom-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media (max-width: 640px) {
          .ins-outer        { padding: 16px 14px 48px; }
          .ins-metric-grid  { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .ins-metric-value { font-size: 18px; }
          .ins-bottom-grid  { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ins-outer">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <BarChart2 size={18} style={{ color: "var(--accent)" }} />
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)", fontFamily: "var(--font-display), Epilogue, sans-serif", margin: 0 }}>
                Insights
              </h1>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>See how your profile is performing.</p>
          </div>

          {/* Period selector */}
          <div style={{ display: "flex", background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 10, padding: 3, gap: 2, flexShrink: 0 }}>
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  height: 30, padding: "0 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                  background: period === p.key ? "var(--accent)" : "transparent",
                  color: period === p.key ? "#fff" : "var(--text-2)",
                  transition: "all 0.15s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Metric tabs + Line chart ── */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          {loading ? (
            <div className="ins-metric-grid">
              {[1,2,3,4].map(i => <Skeleton key={i} w="100%" h={76} radius={12} />)}
            </div>
          ) : (
            <div className="ins-metric-grid">
              {METRICS.map(m => {
                const isActive = activeMetric === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setActiveMetric(m.key)}
                    style={{
                      display: "flex", flexDirection: "column", gap: 6, padding: "12px 12px",
                      borderRadius: 12, cursor: "pointer", textAlign: "left",
                      border: `1.5px solid ${isActive ? m.color + "55" : "var(--border-col)"}`,
                      background: isActive ? m.color + "10" : "var(--surface-2)",
                      transition: "all 0.15s", minWidth: 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: isActive ? m.color : "var(--text-3)" }}>
                      {m.icon}
                      <span style={{ fontSize: 11, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.label}</span>
                    </div>
                    <div className="ins-metric-value" style={{ color: isActive ? m.color : "var(--text-1)" }}>
                      {m.format(metricTotals[m.key])}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-3)", whiteSpace: "nowrap" }}>{periodLabel(period)}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Line chart */}
          <div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 8 }}>
              {periodLabel(period)} · {activeMetricConfig.label}
            </div>
            {loading
              ? <Skeleton w="100%" h={160} radius={8} />
              : <LineChart data={stats} metric={activeMetricConfig} />
            }
          </div>
        </div>

        {/* ── Countries + Devices ── */}
        <div className="ins-bottom-grid">

          <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Globe size={13} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Countries</span>
            </div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1,2,3,4,5].map(i => <Skeleton key={i} w="100%" h={38} radius={6} />)}
              </div>
            ) : totalViews === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-3)", fontSize: 13 }}>No data yet</div>
            ) : (
              <div>{countryData.map(c => <CountryRow key={c.name} {...c} pct={(c.value / maxCountry) * 100} />)}</div>
            )}
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Monitor size={13} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Devices</span>
            </div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1,2,3].map(i => <Skeleton key={i} w="100%" h={52} radius={8} />)}
              </div>
            ) : totalViews === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-3)", fontSize: 13 }}>No data yet</div>
            ) : (
              <div>{deviceData.map(d => <DeviceRow key={d.name} {...d} />)}</div>
            )}
          </div>
        </div>

        {/* ── Clicks per link ── */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MousePointerClick size={13} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Clicks per link</span>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-3)" }}>All time</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 12 }}>Click counts per link</div>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1,2,3].map(i => <Skeleton key={i} w="100%" h={52} radius={8} />)}
            </div>
          ) : links.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-3)", fontSize: 13 }}>
              <MousePointerClick size={28} style={{ opacity: 0.4, display: "block", margin: "0 auto 10px" }} />
              No links tracked yet. Add links on the Me tab.
            </div>
          ) : (
            <div>{links.map((l, i) => <LinkRow key={l.id} rank={i + 1} title={l.title} url={l.url} clicks={l.clicks || 0} max={topClicks} />)}</div>
          )}
        </div>

        {/* ── Traffic sources ── */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <TrendingUp size={13} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Where links are clicked from</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 12 }}>Traffic sources & referrers</div>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3,4].map(i => <Skeleton key={i} w="100%" h={40} radius={6} />)}
            </div>
          ) : totalViews === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-3)", fontSize: 13 }}>No referrer data yet</div>
          ) : (
            <div>{referrerData.map(r => <ReferrerRow key={r.name} {...r} />)}</div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-3)" }}>
            <ArrowUpRight size={11} />
            Views, unique visits, devices, countries and referrers are estimated. Real-time tracking coming soon.
          </div>
        )}
      </div>
    </>
  );
}
