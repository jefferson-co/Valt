import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Profile, Link as LinkType, Social, Theme } from "@/types/database";

/* ─── Helpers ─── */

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

function buildBackground(theme: Theme): string {
  if (theme.bg_gradient) {
    try {
      const g = JSON.parse(theme.bg_gradient) as {
        from: string;
        to: string;
        angle: number;
      };
      return `linear-gradient(${g.angle}deg, ${g.from}, ${g.to})`;
    } catch {
      // fall through to solid color
    }
  }
  return theme.bg_color ?? "#0A0A0A";
}

function buildButtonStyle(theme: Theme): React.CSSProperties {
  const bg = theme.button_color ?? "#ffffff";
  const color = theme.button_text_color ?? getContrastColor(bg);
  const base: React.CSSProperties = {
    background: bg,
    color,
    width: "100%",
    padding: "14px 20px",
    fontSize: "15px",
    fontWeight: 500,
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    transition: "opacity 0.15s",
  };

  switch (theme.button_style) {
    case "pill":
      return { ...base, borderRadius: "9999px" };
    case "sharp":
      return { ...base, borderRadius: "0px" };
    case "outline":
      return {
        ...base,
        background: "transparent",
        border: `2px solid ${bg}`,
        color: bg,
        borderRadius: "12px",
      };
    default: // rounded
      return { ...base, borderRadius: "12px" };
  }
}

/* ─── Social Icons ─── */

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SocialIcon({
  platform,
  url,
  style,
  color,
}: {
  platform: string;
  url: string;
  style: string;
  color: string;
}) {
  const iconColor = style === "filled" ? getContrastColor(color) : color;
  const bgStyle: React.CSSProperties =
    style === "filled"
      ? { background: color, borderRadius: "50%", padding: "8px" }
      : style === "outlined"
      ? {
          border: `1.5px solid ${color}`,
          borderRadius: "50%",
          padding: "7px",
        }
      : { padding: "8px" };

  const icons: Record<string, React.ReactNode> = {
    x: <XIcon size={18} />,
    linkedin: <LinkedInIcon size={18} />,
    instagram: <InstagramIcon size={18} />,
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: iconColor, display: "inline-flex", alignItems: "center", ...bgStyle }}
    >
      {icons[platform] ?? null}
    </a>
  );
}

/* ─── Default theme ─── */

const DEFAULT_THEME: Partial<Theme> = {
  bg_color: "#0A0A0A",
  bg_gradient: null,
  button_style: "rounded",
  button_color: "#ffffff",
  button_text_color: "#000000",
  font_primary: "DM Sans",
  icon_style: "outlined",
};

/* ─── Page ─── */

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profileData) {
    notFound();
  }

  const profile = profileData as Profile;

  const [linksRes, socialsRes, themeRes] = await Promise.all([
    supabase
      .from("links")
      .select("*")
      .eq("user_id", profile.id)
      .eq("is_active", true)
      .order("position"),
    supabase.from("socials").select("*").eq("user_id", profile.id),
    supabase.from("themes").select("*").eq("user_id", profile.id).single(),
  ]);

  const links = (linksRes.data ?? []) as LinkType[];
  const socials = (socialsRes.data ?? []) as Social[];
  const rawTheme = themeRes.data as Theme | null;
  const theme = { ...DEFAULT_THEME, ...rawTheme } as Theme;

  const background = buildBackground(theme);
  const buttonStyle = buildButtonStyle(theme);
  const fontFamily = theme.font_primary ?? "DM Sans";
  const textColor = theme.bg_gradient
    ? getContrastColor(
        JSON.parse(theme.bg_gradient ?? "{}").from ?? theme.bg_color ?? "#0A0A0A"
      )
    : getContrastColor(theme.bg_color ?? "#0A0A0A");

  const socialColor = textColor;

  return (
    <>
      {/* Load selected Google Font */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily).replace(/%20/g, "+")}:wght@400;500;600;700&display=swap');`,
        }}
      />

      <div
        style={{
          minHeight: "100vh",
          background,
          fontFamily: `'${fontFamily}', sans-serif`,
          color: textColor,
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            padding: "48px 20px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.username}
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 16,
              }}
            />
          ) : (
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: `${textColor}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              {(profile.display_name ?? profile.username)[0].toUpperCase()}
            </div>
          )}

          {/* Name */}
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: textColor,
              textAlign: "center",
            }}
          >
            {profile.display_name ?? profile.username}
          </h1>

          {/* Bio */}
          {profile.bio && (
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: `${textColor}99`,
                textAlign: "center",
                maxWidth: 360,
              }}
            >
              {profile.bio}
            </p>
          )}

          {/* Social Icons */}
          {socials.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 20,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {socials.map((s) => (
                <SocialIcon
                  key={s.platform}
                  platform={s.platform}
                  url={s.url}
                  style={theme.icon_style ?? "outlined"}
                  color={socialColor}
                />
              ))}
            </div>
          )}

          {/* Links */}
          {links.length > 0 && (
            <div
              style={{
                width: "100%",
                marginTop: 32,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={buttonStyle}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}

          {/* CV Button */}
          {profile.cv_url && (
            <div style={{ width: "100%", marginTop: links.length > 0 ? 12 : 32 }}>
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...buttonStyle,
                  opacity: 0.75,
                }}
              >
                Download CV / Resume
              </a>
            </div>
          )}

          {/* Empty state */}
          {links.length === 0 && !profile.cv_url && (
            <p
              style={{
                marginTop: 40,
                fontSize: 14,
                color: `${textColor}55`,
                textAlign: "center",
              }}
            >
              No links yet. Check back soon.
            </p>
          )}

          {/* Valt watermark */}
          <a
            href="/"
            style={{
              marginTop: 48,
              fontSize: 12,
              color: `${textColor}40`,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="5" fill="currentColor" />
              <path
                d="M7 8L11 14L15 8"
                stroke={textColor}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Made with Valt
          </a>
        </div>
      </div>
    </>
  );
}
