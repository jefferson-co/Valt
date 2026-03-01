"use client";

import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { Check, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const FONTS = [
  { name: "DM Sans", family: "DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700" },
  { name: "Nunito", family: "Nunito:wght@400;500;600;700" },
  { name: "Poppins", family: "Poppins:wght@400;500;600;700" },
  { name: "Raleway", family: "Raleway:wght@400;500;600;700" },
  { name: "Outfit", family: "Outfit:wght@400;500;600;700" },
  { name: "Plus Jakarta Sans", family: "Plus+Jakarta+Sans:wght@400;500;600;700" },
  { name: "Josefin Sans", family: "Josefin+Sans:wght@400;600;700" },
  { name: "Manrope", family: "Manrope:wght@400;500;600;700" },
];

const BUTTON_STYLES = [
  { value: "rounded", label: "Rounded", radius: "12px" },
  { value: "pill", label: "Pill", radius: "9999px" },
  { value: "sharp", label: "Sharp", radius: "0px" },
  { value: "outline", label: "Outline", radius: "12px" },
] as const;

const ICON_STYLES = [
  { value: "outlined", label: "Outlined" },
  { value: "filled", label: "Filled" },
  { value: "minimal", label: "Minimal" },
] as const;

const GRADIENT_ANGLES = [
  { label: "↓", value: 180 },
  { label: "↘", value: 135 },
  { label: "→", value: 90 },
  { label: "↗", value: 45 },
];

type ButtonStyleValue = "rounded" | "pill" | "sharp" | "outline";
type IconStyleValue = "outlined" | "filled" | "minimal";

interface ThemeState {
  bgColor: string;
  useGradient: boolean;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  buttonStyle: ButtonStyleValue;
  buttonColor: string;
  buttonTextColor: string;
  fontPrimary: string;
  iconStyle: IconStyleValue;
}

const DEFAULT_THEME: ThemeState = {
  bgColor: "#0a0a0a",
  useGradient: false,
  gradientFrom: "#6366f1",
  gradientTo: "#8b5cf6",
  gradientAngle: 135,
  buttonStyle: "rounded",
  buttonColor: "#ffffff",
  buttonTextColor: "#000000",
  fontPrimary: "DM Sans",
  iconStyle: "outlined",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5
    ? "#000000"
    : "#ffffff";
}

function buildBackground(t: ThemeState): string {
  if (t.useGradient) {
    return `linear-gradient(${t.gradientAngle}deg, ${t.gradientFrom}, ${t.gradientTo})`;
  }
  return t.bgColor;
}

function serializeGradient(t: ThemeState): string | null {
  if (!t.useGradient) return null;
  return JSON.stringify({ from: t.gradientFrom, to: t.gradientTo, angle: t.gradientAngle });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#9CA3AF]"
    >
      {children}
    </h2>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#374151]">{label}</label>
      <div className="flex items-center gap-3">
        <div
          className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-[#D1D5DB]"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value);
          }}
          className="h-10 w-28 rounded-lg border border-[#D1D5DB] bg-white px-3 font-mono text-sm text-[#111827] uppercase focus:border-[#6B7280] focus:outline-none"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function PhonePreview({ theme }: { theme: ThemeState }) {
  const bg = buildBackground(theme);
  const textColor = getContrastColor(
    theme.useGradient ? theme.gradientFrom : theme.bgColor
  );
  const mutedTextColor =
    textColor === "#ffffff" ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";

  const btnRadius =
    theme.buttonStyle === "pill"
      ? "9999px"
      : theme.buttonStyle === "sharp"
      ? "0px"
      : "10px";

  const btnStyle: React.CSSProperties =
    theme.buttonStyle === "outline"
      ? {
          background: "transparent",
          border: `2px solid ${theme.buttonColor}`,
          color: theme.buttonColor,
          borderRadius: btnRadius,
        }
      : {
          background: theme.buttonColor,
          color: theme.buttonTextColor,
          borderRadius: btnRadius,
        };

  // Social icon rendering
  const socialIconStyle: React.CSSProperties =
    theme.iconStyle === "filled"
      ? {
          background: theme.buttonColor,
          color: theme.buttonTextColor,
          borderRadius: "9999px",
          padding: "6px",
          display: "inline-flex",
        }
      : theme.iconStyle === "outlined"
      ? {
          border: `1.5px solid ${mutedTextColor}`,
          borderRadius: "9999px",
          padding: "6px",
          display: "inline-flex",
          color: textColor,
        }
      : {
          color: mutedTextColor,
          display: "inline-flex",
        };

  const SAMPLE_LINKS = ["My Portfolio", "Latest Work", "Book a Call"];

  return (
    <div className="flex justify-center">
      {/* Phone frame */}
      <div
        className="relative overflow-hidden rounded-[36px] shadow-2xl"
        style={{
          width: 280,
          height: 560,
          border: "10px solid #1a1a1a",
          boxShadow: "0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2"
          style={{
            width: 80,
            height: 20,
            background: "#1a1a1a",
            borderRadius: "0 0 14px 14px",
          }}
        />

        {/* Content */}
        <div
          className="h-full w-full overflow-y-auto"
          style={{ background: bg, fontFamily: `"${theme.fontPrimary}", sans-serif` }}
        >
          <div className="flex flex-col items-center px-5 pb-8 pt-10 text-center">
            {/* Avatar */}
            <div
              className="h-16 w-16 rounded-full"
              style={{
                background:
                  textColor === "#ffffff"
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.1)",
              }}
            />

            {/* Name */}
            <p
              className="mt-3 text-base font-semibold"
              style={{ color: textColor }}
            >
              Your Name
            </p>

            {/* Bio */}
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: mutedTextColor, maxWidth: 180 }}
            >
              Your bio goes here
            </p>

            {/* Social icons */}
            <div className="mt-3 flex items-center gap-3">
              {["X", "in", "ig"].map((icon) => (
                <span key={icon} style={socialIconStyle}>
                  <span className="text-[10px] font-bold leading-none">{icon}</span>
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="mt-5 w-full space-y-2.5">
              {SAMPLE_LINKS.map((link) => (
                <div
                  key={link}
                  className="w-full py-3 text-center text-[11px] font-medium"
                  style={btnStyle}
                >
                  {link}
                </div>
              ))}
            </div>

            {/* CV Button */}
            <div
              className="mt-2.5 w-full py-3 text-center text-[11px] font-medium"
              style={btnStyle}
            >
              View CV →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AppearancePage() {
  const [theme, setTheme] = useState<ThemeState>(DEFAULT_THEME);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load Google Fonts
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS.map(
      (f) =>
        `@import url('https://fonts.googleapis.com/css2?family=${f.family}&display=swap');`
    ).join("\n");
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Load existing theme
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("themes")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        let gradientFrom = "#6366f1";
        let gradientTo = "#8b5cf6";
        let gradientAngle = 135;
        let useGradient = false;

        if (data.bg_gradient) {
          try {
            const g = JSON.parse(data.bg_gradient);
            gradientFrom = g.from;
            gradientTo = g.to;
            gradientAngle = g.angle;
            useGradient = true;
          } catch {}
        }

        setTheme({
          bgColor: data.bg_color || "#0a0a0a",
          useGradient,
          gradientFrom,
          gradientTo,
          gradientAngle,
          buttonStyle: data.button_style || "rounded",
          buttonColor: data.button_color || "#ffffff",
          buttonTextColor: data.button_text_color || "#000000",
          fontPrimary: data.font_primary || "DM Sans",
          iconStyle: data.icon_style || "outlined",
        });
      }
      setLoaded(true);
    }
    load();
  }, []);

  function set<K extends keyof ThemeState>(key: K, value: ThemeState[K]) {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      bg_color: theme.bgColor,
      bg_gradient: serializeGradient(theme),
      button_style: theme.buttonStyle,
      button_color: theme.buttonColor,
      button_text_color: theme.buttonTextColor,
      font_primary: theme.fontPrimary,
      font_secondary: theme.fontPrimary,
      icon_style: theme.iconStyle,
    };

    const { error } = await supabase
      .from("themes")
      .upsert(payload, { onConflict: "user_id" });

    setSaving(false);
    setMessage(error ? error.message : "Theme saved!");
    if (!error) setTimeout(() => setMessage(""), 3000);
  }

  if (!loaded) {
    return (
      <div>
        <h1
          className="font-display text-2xl font-bold text-[#111827]"
          style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
        >
          Appearance
        </h1>
        <p className="mt-4 text-sm text-[#6B7280]">Loading theme...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#111827]"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
          >
            Appearance
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Customize how your public profile looks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`flex items-center gap-1.5 text-sm ${
                message.includes("!") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message.includes("!") && <Check className="h-4 w-4" />}
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#111827] px-5 text-sm font-medium text-white transition-colors hover:bg-[#1f2937] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save theme"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* ── Controls ── */}
        <div className="space-y-6">

          {/* Background */}
          <Card>
            <SectionLabel>Background</SectionLabel>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => set("useGradient", false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  !theme.useGradient
                    ? "bg-[#111827] text-white"
                    : "border border-[#D1D5DB] text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                Solid
              </button>
              <button
                onClick={() => set("useGradient", true)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  theme.useGradient
                    ? "bg-[#111827] text-white"
                    : "border border-[#D1D5DB] text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                Gradient
              </button>
            </div>

            {!theme.useGradient ? (
              <ColorPicker
                label="Background color"
                value={theme.bgColor}
                onChange={(v) => set("bgColor", v)}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="From"
                    value={theme.gradientFrom}
                    onChange={(v) => set("gradientFrom", v)}
                  />
                  <ColorPicker
                    label="To"
                    value={theme.gradientTo}
                    onChange={(v) => set("gradientTo", v)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Direction
                  </label>
                  <div className="flex gap-2">
                    {GRADIENT_ANGLES.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => set("gradientAngle", a.value)}
                        className={`h-10 w-10 rounded-lg text-base font-medium transition-colors ${
                          theme.gradientAngle === a.value
                            ? "bg-[#111827] text-white"
                            : "border border-[#D1D5DB] text-[#6B7280] hover:bg-gray-50"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Gradient preview */}
                <div
                  className="h-12 rounded-xl"
                  style={{ background: buildBackground(theme) }}
                />
              </div>
            )}
          </Card>

          {/* Button Style */}
          <Card>
            <SectionLabel>Button Style</SectionLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BUTTON_STYLES.map((s) => {
                const isActive = theme.buttonStyle === s.value;
                const isOutline = s.value === "outline";
                return (
                  <button
                    key={s.value}
                    onClick={() => set("buttonStyle", s.value)}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                      isActive
                        ? "border-[#111827] bg-[#F3F4F6]"
                        : "border-[#E5E7EB] hover:border-[#9CA3AF]"
                    }`}
                  >
                    <div
                      className="w-full py-2 text-center text-xs font-medium"
                      style={{
                        borderRadius: s.radius,
                        background: isOutline ? "transparent" : "#111827",
                        border: isOutline ? "2px solid #111827" : "none",
                        color: isOutline ? "#111827" : "white",
                      }}
                    >
                      Link
                    </div>
                    <span className="text-xs text-[#6B7280]">{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ColorPicker
                label="Button color"
                value={theme.buttonColor}
                onChange={(v) => set("buttonColor", v)}
              />
              <ColorPicker
                label="Button text color"
                value={theme.buttonTextColor}
                onChange={(v) => set("buttonTextColor", v)}
              />
            </div>
          </Card>

          {/* Typography */}
          <Card>
            <SectionLabel>Typography</SectionLabel>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Font
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {FONTS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => set("fontPrimary", f.name)}
                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                      theme.fontPrimary === f.name
                        ? "border-[#111827] bg-[#F3F4F6]"
                        : "border-[#E5E7EB] hover:border-[#9CA3AF]"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        theme.fontPrimary === f.name
                          ? "bg-[#111827] text-white"
                          : "bg-[#F3F4F6] text-[#6B7280]"
                      }`}
                    >
                      A
                    </span>
                    <span
                      className="text-sm text-[#111827]"
                      style={{ fontFamily: `"${f.name}", sans-serif` }}
                    >
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Icon Style */}
          <Card>
            <SectionLabel>Social Icon Style</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {ICON_STYLES.map((style) => {
                const isActive = theme.iconStyle === style.value;
                return (
                  <button
                    key={style.value}
                    onClick={() => set("iconStyle", style.value)}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                      isActive
                        ? "border-[#111827] bg-[#F3F4F6]"
                        : "border-[#E5E7EB] hover:border-[#9CA3AF]"
                    }`}
                  >
                    {/* Icon preview */}
                    <div className="flex items-center gap-1.5">
                      {["X", "in", "ig"].map((icon) => (
                        <span
                          key={icon}
                          className="flex items-center justify-center text-[9px] font-bold"
                          style={
                            style.value === "outlined"
                              ? { border: "1.5px solid #6B7280", borderRadius: "9999px", width: 22, height: 22, color: "#374151" }
                              : style.value === "filled"
                              ? { background: "#111827", borderRadius: "9999px", width: 22, height: 22, color: "white" }
                              : { color: "#6B7280", width: 22, height: 22 }
                          }
                        >
                          {icon}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[#6B7280]">{style.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Live Preview ── */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#6B7280]">
            <Monitor className="h-4 w-4" />
            Live Preview
          </div>
          <PhonePreview theme={theme} />
        </div>
      </div>
    </div>
  );
}
