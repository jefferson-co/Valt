"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { Profile, Link as LinkType, Social } from "@/types/database";
import { Camera, Check, ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";

/* ─── Theme constants ─── */
const FONTS = [
  { name: "DM Sans",           family: "DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700" },
  { name: "Nunito",            family: "Nunito:wght@400;500;600;700" },
  { name: "Poppins",           family: "Poppins:wght@400;500;600;700" },
  { name: "Raleway",           family: "Raleway:wght@400;500;600;700" },
  { name: "Outfit",            family: "Outfit:wght@400;500;600;700" },
  { name: "Plus Jakarta Sans", family: "Plus+Jakarta+Sans:wght@400;500;600;700" },
  { name: "Josefin Sans",      family: "Josefin+Sans:wght@400;600;700" },
  { name: "Manrope",           family: "Manrope:wght@400;500;600;700" },
];

const BUTTON_STYLES = [
  { value: "rounded", label: "Rounded", radius: "12px"   },
  { value: "pill",    label: "Pill",    radius: "9999px"  },
  { value: "sharp",   label: "Sharp",   radius: "0px"     },
  { value: "outline", label: "Outline", radius: "12px"    },
] as const;

type ButtonStyleValue = "rounded" | "pill" | "sharp" | "outline";
type IconStyleValue   = "outlined" | "filled" | "minimal";

interface ThemeState {
  bgColor:         string;
  useGradient:     boolean;
  gradientFrom:    string;
  gradientTo:      string;
  gradientAngle:   number;
  buttonStyle:     ButtonStyleValue;
  buttonColor:     string;
  buttonTextColor: string;
  fontPrimary:     string;
  iconStyle:       IconStyleValue;
}

const DEFAULT_THEME: ThemeState = {
  bgColor:         "#0a0a0a",
  useGradient:     false,
  gradientFrom:    "#6366f1",
  gradientTo:      "#8b5cf6",
  gradientAngle:   135,
  buttonStyle:     "rounded",
  buttonColor:     "#ffffff",
  buttonTextColor: "#000000",
  fontPrimary:     "DM Sans",
  iconStyle:       "outlined",
};

interface Section { id: string; title: string; position: number; }

/* ─── Helpers ─── */
function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff";
}

function buildBackground(t: ThemeState): string {
  if (t.useGradient) return `linear-gradient(${t.gradientAngle}deg, ${t.gradientFrom}, ${t.gradientTo})`;
  return t.bgColor;
}

function serializeGradient(t: ThemeState): string | null {
  if (!t.useGradient) return null;
  return JSON.stringify({ from: t.gradientFrom, to: t.gradientTo, angle: t.gradientAngle });
}

function buildBtnStyle(t: ThemeState): React.CSSProperties {
  const bg    = t.buttonColor;
  const color = t.buttonTextColor;
  const base: React.CSSProperties = { background: bg, color, padding: "11px 16px", fontSize: 13, fontWeight: 500, textAlign: "center", width: "100%", display: "block" };
  switch (t.buttonStyle) {
    case "pill":    return { ...base, borderRadius: "9999px" };
    case "sharp":   return { ...base, borderRadius: "0px" };
    case "outline": return { ...base, background: "transparent", border: `2px solid ${bg}`, color: bg, borderRadius: "12px" };
    default:        return { ...base, borderRadius: "10px" };
  }
}

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

const SOCIAL_ICONS: Record<string, (s: number) => React.ReactNode> = {
  x:         (s) => <XIcon size={s} />,
  linkedin:  (s) => <LinkedInIcon size={s} />,
  instagram: (s) => <InstagramIcon size={s} />,
};

/* ─── SectionCard ─── */
function SectionCard({
  title, count, defaultOpen = false, renameable = false, onRename, children,
}: {
  title: string; count?: number; defaultOpen?: boolean; renameable?: boolean;
  onRename?: (t: string) => void; children: React.ReactNode;
}) {
  const [open,    setOpen]    = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(title);

  function commit() {
    setEditing(false);
    if (draft.trim() && onRename) onRename(draft.trim());
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-col)", borderRadius: 14 }}>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", cursor: "pointer", userSelect: "none" }}
        onClick={() => !editing && setOpen((o) => !o)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setEditing(false); setDraft(title); } }}
              autoFocus
              style={{ background: "var(--surface-2)", border: "1px solid var(--accent)", borderRadius: 6, padding: "2px 8px", fontSize: 13, fontWeight: 600, color: "var(--text-1)", outline: "none", flex: 1 }}
            />
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
          )}
          {count !== undefined && !editing && (
            <span style={{ fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border-col)", borderRadius: 9999, padding: "1px 7px", color: "var(--text-3)", flexShrink: 0 }}>
              {count}
            </span>
          )}
          {renameable && !editing && (
            <button onClick={(e) => { e.stopPropagation(); setEditing(true); setOpen(true); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 2, display: "flex", flexShrink: 0 }}>
              <Pencil size={10} />
            </button>
          )}
          {editing && (
            <button onClick={(e) => { e.stopPropagation(); commit(); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", padding: 2, display: "flex", flexShrink: 0 }}>
              <Check size={12} />
            </button>
          )}
        </div>
        <div style={{ color: "var(--text-3)", flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
          <ChevronDown size={14} />
        </div>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid var(--border-col)", padding: "14px 16px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Toggle ─── */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width: 38, height: 21, borderRadius: 10.5, background: on ? "var(--accent)" : "var(--surface-2)", border: "1px solid var(--border-col)", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 15, height: 15, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
    </button>
  );
}

/* ─── ColorSwatch ─── */
function ColorSwatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 11, color: "var(--text-2)" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ position: "relative", width: 32, height: 32, borderRadius: 8, background: value, border: "1px solid var(--border-col)", overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
        </div>
        <input type="text" value={value}
          onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
          style={{ height: 32, width: 88, background: "var(--surface-2)", border: "1px solid var(--border-col)", borderRadius: 8, padding: "0 10px", fontFamily: "monospace", fontSize: 12, color: "var(--text-1)", outline: "none", textTransform: "uppercase" }}
          maxLength={7}
        />
      </div>
    </div>
  );
}

/* ─── Live Preview ─── */
function LivePreview({ profile, links, socials, theme }: {
  profile: Partial<Profile>; links: LinkType[]; socials: Social[]; theme: ThemeState;
}) {
  const bg          = buildBackground(theme);
  const textColor   = getContrastColor(theme.useGradient ? theme.gradientFrom : theme.bgColor);
  const mutedText   = textColor === "#ffffff" ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.45)";
  const btnStyle    = buildBtnStyle(theme);
  const name        = profile.display_name || profile.username || "Your Name";
  const activeLinks = links.filter((l) => l.is_active);

  const socialBg = (style: string): React.CSSProperties => {
    if (style === "filled")   return { background: theme.buttonColor, borderRadius: "50%", padding: 7, display: "inline-flex", alignItems: "center", justifyContent: "center", color: theme.buttonTextColor };
    if (style === "outlined") return { border: `1.5px solid ${textColor}55`, borderRadius: "50%", padding: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", color: textColor };
    return { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 6, color: mutedText };
  };

  return (
    <div style={{
      background: bg, borderRadius: 20, overflow: "hidden",
      fontFamily: `"${theme.fontPrimary}", sans-serif`,
      boxShadow: "0 2px 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.5)",
      maxWidth: 380, margin: "0 auto",
    }}>
      <div style={{ padding: "44px 24px 52px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Avatar */}
        {profile.avatar_url
          ? <img src={profile.avatar_url} alt={name} style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", marginBottom: 14 }} />
          : <div style={{ width: 76, height: 76, borderRadius: "50%", background: `${textColor}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: textColor, marginBottom: 14 }}>
              {name[0]?.toUpperCase()}
            </div>
        }

        {/* Name */}
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: textColor, textAlign: "center", lineHeight: 1.2 }}>{name}</h2>

        {/* Bio */}
        {profile.bio && (
          <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.6, color: mutedText, textAlign: "center", maxWidth: 280 }}>{profile.bio}</p>
        )}

        {/* Socials */}
        {socials.filter((s) => s.url).length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
            {socials.filter((s) => s.url).map((s) => (
              <span key={s.platform} style={socialBg(theme.iconStyle)}>
                {SOCIAL_ICONS[s.platform]?.(16)}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {activeLinks.length > 0 && (
          <div style={{ width: "100%", marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            {activeLinks.map((link) => (
              <div key={link.id} style={btnStyle}>{link.title}</div>
            ))}
          </div>
        )}

        {/* Empty hint */}
        {activeLinks.length === 0 && !profile.bio && (
          <p style={{ marginTop: 24, fontSize: 12, color: `${textColor}40`, textAlign: "center" }}>Fill in your details →</p>
        )}

        {/* Watermark */}
        <div style={{ marginTop: 40, fontSize: 11, color: `${textColor}35`, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="11" height="11" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="5" fill="currentColor" />
            <path d="M7 8L11 14L15 8" stroke={textColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Made with Valt
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function FeelPage() {
  const [profile,       setProfile]       = useState<Partial<Profile>>({});
  const [links,         setLinks]         = useState<LinkType[]>([]);
  const [socials,       setSocials]       = useState<Social[]>([]);
  const [sections,      setSections]      = useState<Section[]>([]);
  const [theme,         setTheme]         = useState<ThemeState>(DEFAULT_THEME);
  const [userId,        setUserId]        = useState<string | null>(null);
  const [loaded,        setLoaded]        = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedProfile,  setSavedProfile]  = useState(false);
  const [profileDirty,  setProfileDirty]  = useState(false);
  const [savingTheme,   setSavingTheme]   = useState(false);
  const [savedTheme,    setSavedTheme]    = useState(false);
  const [savingLinks,   setSavingLinks]   = useState(false);
  const [addingLink,    setAddingLink]    = useState(false);
  const [newLinkTitle,  setNewLinkTitle]  = useState("");
  const [newLinkUrl,    setNewLinkUrl]    = useState("");
  const [socialDrafts,    setSocialDrafts]    = useState<Record<string, string>>({ x: "", linkedin: "", instagram: "" });
  const [savingSocials,   setSavingSocials]   = useState(false);
  const [savedSocials,    setSavedSocials]    = useState(false);
  const [socialsDirty,    setSocialsDirty]    = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  /* Load Google Fonts */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS.map((f) =>
      `@import url('https://fonts.googleapis.com/css2?family=${f.family}&display=swap');`
    ).join("\n");
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  /* Load all data */
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [p, l, s, sec, t] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("links").select("*").eq("user_id", user.id).order("position"),
        supabase.from("socials").select("*").eq("user_id", user.id),
        supabase.from("sections").select("*").eq("user_id", user.id).order("position"),
        supabase.from("themes").select("*").eq("user_id", user.id).single(),
      ]);
      if (p.data) setProfile(p.data as Profile);
      if (l.data) setLinks(l.data as LinkType[]);
      if (s.data) {
        setSocials(s.data as Social[]);
        const drafts: Record<string, string> = { x: "", linkedin: "", instagram: "" };
        for (const soc of s.data as Social[]) {
          if (soc.platform in drafts) drafts[soc.platform] = soc.url;
        }
        setSocialDrafts(drafts);
      }
      if (sec.data) setSections(sec.data as Section[]);
      if (t.data) {
        const td = t.data;
        let gradientFrom = "#6366f1", gradientTo = "#8b5cf6", gradientAngle = 135, useGradient = false;
        if (td.bg_gradient) {
          try {
            const g = JSON.parse(td.bg_gradient);
            gradientFrom = g.from; gradientTo = g.to; gradientAngle = g.angle; useGradient = true;
          } catch { /* ignore */ }
        }
        setTheme({
          bgColor: td.bg_color || "#0a0a0a", useGradient,
          gradientFrom, gradientTo, gradientAngle,
          buttonStyle: td.button_style || "rounded",
          buttonColor: td.button_color || "#ffffff",
          buttonTextColor: td.button_text_color || "#000000",
          fontPrimary: td.font_primary || "DM Sans",
          iconStyle: td.icon_style || "outlined",
        });
      }
      setLoaded(true);
    }
    load();
  }, []);

  /* Avatar upload */
  async function handleAvatarUpload(file: File) {
    if (!userId) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
    setUploadingAvatar(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
      setProfile((p) => ({ ...p, avatar_url: publicUrl }));
    }
    setUploadingAvatar(false);
  }

  /* Profile save */
  async function saveProfile() {
    if (!userId) return;
    setSavingProfile(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ display_name: profile.display_name, bio: profile.bio }).eq("id", userId);
    setSavingProfile(false);
    setSavedProfile(true);
    setProfileDirty(false);
    setTimeout(() => setSavedProfile(false), 2500);
  }

  /* Social save (explicit button) */
  async function saveSocials() {
    if (!userId) return;
    setSavingSocials(true);
    const supabase = createClient();
    const platforms = ["x", "linkedin", "instagram"] as const;
    for (const platform of platforms) {
      const url = socialDrafts[platform]?.trim() ?? "";
      if (!url) {
        await supabase.from("socials").delete().eq("user_id", userId).eq("platform", platform);
      } else {
        await supabase.from("socials").upsert({ user_id: userId, platform, url }, { onConflict: "user_id,platform" });
      }
    }
    const newSocials: Social[] = platforms
      .filter((p) => socialDrafts[p]?.trim())
      .map((p) => ({ id: "", user_id: userId!, platform: p as Social["platform"], url: socialDrafts[p] }));
    setSocials(newSocials);
    setSavingSocials(false);
    setSavedSocials(true);
    setSocialsDirty(false);
    setTimeout(() => setSavedSocials(false), 2500);
  }

  /* Link CRUD */
  async function addLink() {
    if (!userId || !newLinkTitle.trim() || !newLinkUrl.trim()) return;
    setSavingLinks(true);
    const supabase = createClient();
    const { data } = await supabase.from("links").insert({ user_id: userId, title: newLinkTitle.trim(), url: newLinkUrl.trim(), position: links.length, is_active: true }).select().single();
    if (data) setLinks((prev) => [...prev, data as LinkType]);
    setNewLinkTitle(""); setNewLinkUrl(""); setAddingLink(false); setSavingLinks(false);
  }

  async function toggleLink(id: string, cur: boolean) {
    const supabase = createClient();
    await supabase.from("links").update({ is_active: !cur }).eq("id", id);
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: !cur } : l)));
  }

  async function deleteLink(id: string) {
    const supabase = createClient();
    await supabase.from("links").delete().eq("id", id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  /* Sections CRUD */
  async function addSection() {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase.from("sections").insert({ user_id: userId, title: "New Section", position: sections.length }).select().single();
    if (data) setSections((prev) => [...prev, data as Section]);
  }

  async function renameSection(id: string, title: string) {
    const supabase = createClient();
    await supabase.from("sections").update({ title }).eq("id", id);
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }

  async function deleteSection(id: string) {
    const supabase = createClient();
    await supabase.from("sections").delete().eq("id", id);
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  /* Theme save */
  async function saveTheme() {
    setSavingTheme(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSavingTheme(false); return; }
    await supabase.from("themes").upsert({
      user_id: user.id,
      bg_color: theme.bgColor,
      bg_gradient: serializeGradient(theme),
      button_style: theme.buttonStyle,
      button_color: theme.buttonColor,
      button_text_color: theme.buttonTextColor,
      font_primary: theme.fontPrimary,
      font_secondary: theme.fontPrimary,
      icon_style: theme.iconStyle,
    }, { onConflict: "user_id" });
    setSavingTheme(false);
    setSavedTheme(true);
    setTimeout(() => setSavedTheme(false), 2500);
  }

  function setT<K extends keyof ThemeState>(key: K, value: ThemeState[K]) {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }

  const socialCount    = socials.filter((s) => s.url).length;
  const activeLinkCount = links.filter((l) => l.is_active).length;

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

      {/* ── Left: Live Preview ── */}
      <div className="feel-preview" style={{ flex: 1, borderRight: "1px solid var(--border-col)", overflowY: "auto", padding: "28px 24px 48px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-3)", margin: "0 0 20px" }}>
          Live Preview
        </p>
        <LivePreview profile={profile} links={links} socials={socials} theme={theme} />
      </div>

      {/* ── Right: Editor ── */}
      <div className="feel-editor" style={{ width: 376, flexShrink: 0, overflowY: "auto", padding: "20px 16px 64px", display: "flex", flexDirection: "column", gap: 8 }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h2 style={{ fontFamily: "var(--font-display), Epilogue, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-1)", margin: 0 }}>
            Your details
          </h2>
          <button onClick={addSection} style={{ display: "flex", alignItems: "center", gap: 5, height: 28, padding: "0 10px", border: "1px solid var(--border-col)", borderRadius: 9999, background: "transparent", color: "var(--text-2)", fontSize: 12, cursor: "pointer" }}>
            <Plus size={11} /> Add section
          </button>
        </div>

        {/* ── About Me ── */}
        <SectionCard title="About Me" defaultOpen>
          {/* Avatar upload */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <label style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                {profile.avatar_url
                  ? <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : <div style={{ width: "100%", height: "100%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "white" }}>
                      {((profile.display_name || profile.username || "?")[0] ?? "?").toUpperCase()}
                    </div>
                }
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "var(--surface)", border: "2px solid var(--border-col)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {uploadingAvatar
                  ? <svg className="animate-spin" width="11" height="11" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="var(--text-3)" strokeWidth="3"/><path className="opacity-75" fill="var(--text-3)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  : <Camera size={11} style={{ color: "var(--text-2)" }} />
                }
              </div>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); }} />
            </label>
          </div>

          <div style={{ marginBottom: 11 }}>
            <label style={{ display: "block", fontSize: 10, color: "var(--text-2)", marginBottom: 4, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Full name
            </label>
            <input
              type="text"
              value={profile.display_name ?? ""}
              onChange={(e) => { setProfile((p) => ({ ...p, display_name: e.target.value })); setProfileDirty(true); setSavedProfile(false); }}
              placeholder="Your display name"
              style={{ width: "100%", height: 36, background: "var(--surface-2)", border: "1px solid var(--border-col)", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "var(--text-1)", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-col)")}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 10, color: "var(--text-2)", marginBottom: 4, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Bio
            </label>
            <textarea
              value={profile.bio ?? ""}
              onChange={(e) => { setProfile((p) => ({ ...p, bio: e.target.value })); setProfileDirty(true); setSavedProfile(false); }}
              placeholder="A short bio about you…"
              rows={3}
              style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border-col)", borderRadius: 8, padding: "7px 10px", fontSize: 13, color: "var(--text-1)", outline: "none", boxSizing: "border-box", resize: "vertical", fontFamily: "var(--font-sans), sans-serif" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-col)")}
            />
          </div>
          <button onClick={saveProfile} disabled={savingProfile || !profileDirty}
            style={{ height: 32, padding: "0 16px", borderRadius: 9999, background: "var(--accent)", border: "none", color: "white", fontSize: 12, fontWeight: 600, cursor: (savingProfile || !profileDirty) ? "not-allowed" : "pointer", opacity: (savingProfile || !profileDirty) ? 0.5 : 1, display: "flex", alignItems: "center", gap: 6 }}>
            {savedProfile ? <><Check size={13} /> Saved</> : savingProfile ? "Saving…" : "Save"}
          </button>
        </SectionCard>

        {/* ── Contact ── */}
        <SectionCard title="Contact" count={socialCount}>
          {(["x", "linkedin", "instagram"] as const).map((platform) => (
            <div key={platform} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "var(--text-2)", flexShrink: 0, display: "flex" }}>
                {SOCIAL_ICONS[platform]?.(15)}
              </span>
              <input
                type="url"
                placeholder={`${platform === "x" ? "X / Twitter" : platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                value={socialDrafts[platform] ?? ""}
                onChange={(e) => { setSocialDrafts((prev) => ({ ...prev, [platform]: e.target.value })); setSocialsDirty(true); setSavedSocials(false); }}
                style={{ flex: 1, height: 34, background: "var(--surface-2)", border: "1px solid var(--border-col)", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "var(--text-1)", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-col)")}
              />
            </div>
          ))}
          <button onClick={saveSocials} disabled={savingSocials || !socialsDirty}
            style={{ marginTop: 2, height: 32, padding: "0 16px", borderRadius: 9999, background: "var(--accent)", border: "none", color: "white", fontSize: 12, fontWeight: 600, cursor: (savingSocials || !socialsDirty) ? "not-allowed" : "pointer", opacity: (savingSocials || !socialsDirty) ? 0.5 : 1, display: "flex", alignItems: "center", gap: 6 }}>
            {savedSocials ? <><Check size={13} /> Saved</> : savingSocials ? "Saving…" : "Save"}
          </button>
        </SectionCard>

        {/* ── Links ── */}
        <SectionCard title="Links" count={activeLinkCount} defaultOpen={links.length > 0}>
          {links.map((link) => (
            <div key={link.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, padding: "8px 10px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border-col)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-1)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.title}</p>
                <p style={{ fontSize: 11, color: "var(--text-3)", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.url}</p>
              </div>
              <Toggle on={link.is_active} onChange={() => toggleLink(link.id, link.is_active)} />
              <button onClick={() => deleteLink(link.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 2, display: "flex" }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {addingLink ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: links.length > 0 ? 8 : 0 }}>
              <input placeholder="Link title" value={newLinkTitle} onChange={(e) => setNewLinkTitle(e.target.value)}
                style={{ height: 34, background: "var(--surface-2)", border: "1px solid var(--border-col)", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "var(--text-1)", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-col)")} />
              <input placeholder="https://" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)}
                style={{ height: 34, background: "var(--surface-2)", border: "1px solid var(--border-col)", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "var(--text-1)", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-col)")} />
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={addLink} disabled={savingLinks} style={{ height: 32, padding: "0 14px", borderRadius: 9999, background: "var(--accent)", border: "none", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Add
                </button>
                <button onClick={() => { setAddingLink(false); setNewLinkTitle(""); setNewLinkUrl(""); }}
                  style={{ height: 32, padding: "0 14px", borderRadius: 9999, background: "var(--surface-2)", border: "1px solid var(--border-col)", color: "var(--text-2)", fontSize: 12, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingLink(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, height: 36, width: "100%", marginTop: links.length > 0 ? 6 : 0, border: "1px dashed var(--border-col)", borderRadius: 10, background: "transparent", color: "var(--text-2)", fontSize: 13, cursor: "pointer", justifyContent: "center" }}>
              <Plus size={14} /> Add link
            </button>
          )}
        </SectionCard>

        {/* ── Appearance ── */}
        <SectionCard title="Appearance">
          {/* Background */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Background</span>
            <div style={{ display: "flex", gap: 6, margin: "8px 0 12px" }}>
              {[{ label: "Solid", val: false }, { label: "Gradient", val: true }].map(({ label, val }) => (
                <button key={label} onClick={() => setT("useGradient", val)}
                  style={{ height: 30, padding: "0 12px", borderRadius: 8, fontSize: 12, fontWeight: theme.useGradient === val ? 600 : 400, cursor: "pointer", background: theme.useGradient === val ? "var(--accent)" : "var(--surface-2)", border: `1px solid ${theme.useGradient === val ? "var(--accent)" : "var(--border-col)"}`, color: theme.useGradient === val ? "#fff" : "var(--text-2)" }}>
                  {label}
                </button>
              ))}
            </div>
            {!theme.useGradient ? (
              <ColorSwatch label="Color" value={theme.bgColor} onChange={(v) => setT("bgColor", v)} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <ColorSwatch label="From" value={theme.gradientFrom} onChange={(v) => setT("gradientFrom", v)} />
                  <ColorSwatch label="To"   value={theme.gradientTo}   onChange={(v) => setT("gradientTo",   v)} />
                </div>
                <div style={{ height: 28, borderRadius: 8, background: buildBackground(theme) }} />
              </div>
            )}
          </div>

          {/* Button shape */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Button shape</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 8 }}>
              {BUTTON_STYLES.map((s) => {
                const isActive = theme.buttonStyle === s.value;
                return (
                  <button key={s.value} onClick={() => setT("buttonStyle", s.value)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 6px", borderRadius: 10, cursor: "pointer", background: isActive ? "var(--surface-2)" : "transparent", border: `1.5px solid ${isActive ? "var(--accent)" : "var(--border-col)"}` }}>
                    <div style={{ width: "100%", padding: "4px 0", textAlign: "center", fontSize: 9, fontWeight: 600, borderRadius: s.radius, background: s.value === "outline" ? "transparent" : "var(--text-1)", border: s.value === "outline" ? "1.5px solid var(--text-1)" : "none", color: s.value === "outline" ? "var(--text-1)" : "var(--bg)" }}>
                      Link
                    </div>
                    <span style={{ fontSize: 9, color: "var(--text-2)" }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              <ColorSwatch label="Button color"      value={theme.buttonColor}     onChange={(v) => setT("buttonColor",     v)} />
              <ColorSwatch label="Text color"        value={theme.buttonTextColor} onChange={(v) => setT("buttonTextColor", v)} />
            </div>
          </div>

          {/* Font */}
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Font</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8 }}>
              {FONTS.map((f) => {
                const isActive = theme.fontPrimary === f.name;
                return (
                  <button key={f.name} onClick={() => setT("fontPrimary", f.name)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, cursor: "pointer", textAlign: "left", background: isActive ? "var(--surface-2)" : "transparent", border: `1.5px solid ${isActive ? "var(--accent)" : "var(--border-col)"}` }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: isActive ? "var(--accent)" : "var(--surface-2)", color: isActive ? "#fff" : "var(--text-2)" }}>
                      A
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-1)", fontFamily: `"${f.name}", sans-serif` }}>{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social icon style */}
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Social icons</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 8 }}>
              {(["outlined", "filled", "minimal"] as const).map((style) => {
                const isActive = theme.iconStyle === style;
                return (
                  <button key={style} onClick={() => setT("iconStyle", style)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 12, borderRadius: 12, cursor: "pointer", background: isActive ? "var(--surface-2)" : "transparent", border: `1.5px solid ${isActive ? "var(--accent)" : "var(--border-col)"}` }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {["X", "in", "ig"].map((icon) => (
                        <span key={icon} style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, ...(style === "filled" ? { background: "var(--text-1)", borderRadius: "50%", color: "var(--bg)" } : style === "outlined" ? { border: "1.5px solid var(--text-3)", borderRadius: "50%", color: "var(--text-2)" } : { color: "var(--text-2)" }) }}>
                          {icon}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: "var(--text-2)", textTransform: "capitalize" }}>{style}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save appearance */}
          <button onClick={saveTheme} disabled={savingTheme}
            style={{ height: 34, padding: "0 20px", borderRadius: 9999, background: "var(--accent)", border: "none", color: "white", fontSize: 12, fontWeight: 600, cursor: savingTheme ? "not-allowed" : "pointer", opacity: savingTheme ? 0.7 : 1, display: "flex", alignItems: "center", gap: 6 }}>
            {savedTheme ? <><Check size={13} /> Saved</> : savingTheme ? "Saving…" : "Save appearance"}
          </button>
        </SectionCard>

        {/* ── Custom sections ── */}
        {sections.map((sec) => (
          <SectionCard key={sec.id} title={sec.title} renameable onRename={(t) => renameSection(sec.id, t)}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => deleteSection(sec.id)}
                style={{ display: "flex", alignItems: "center", gap: 5, height: 28, padding: "0 10px", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 9999, background: "transparent", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                <Trash2 size={11} /> Remove
              </button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
