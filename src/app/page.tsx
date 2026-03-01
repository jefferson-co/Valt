import Link from "next/link";
import {
  BarChart3,
  FileText,
  GripVertical,
  Link2,
  Palette,
  Settings2,
  Share2,
  Layers,
} from "lucide-react";

/* ─── Logo mark ─── */
function ValtLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect width="22" height="22" rx="5" fill="white" />
        <path
          d="M7 8L11 14L15 8"
          stroke="#0A0A0A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
        className="text-[18px] font-bold text-white"
      >
        Valt
      </span>
    </div>
  );
}

const BRANDS = [
  "Synergy™",
  "Apex™",
  "Catalyst™",
  "Horizon™",
  "Solaris™",
  "Pulse™",
];

const FEATURES = [
  {
    icon: Palette,
    title: "Customizable Themes",
    desc: "Colors, gradients, fonts, and button styles — all yours to control.",
  },
  {
    icon: BarChart3,
    title: "Link Analytics",
    desc: "Track page views, link clicks, and referral sources in real time.",
  },
  {
    icon: FileText,
    title: "CV / Resume Upload",
    desc: "Upload a PDF and let visitors preview or download it directly.",
  },
  {
    icon: Share2,
    title: "Social Icons",
    desc: "X, LinkedIn, Instagram — displayed with your chosen icon style.",
  },
  {
    icon: Layers,
    title: "Custom Sections",
    desc: "Group your links under labeled sections for clarity.",
  },
  {
    icon: GripVertical,
    title: "Drag & Reorder",
    desc: "Rearrange links in seconds. Your page, your order.",
  },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#0A0A0A", color: "#fff" }}
    >
      {/* ── Navigation ── */}
      <header
        className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 md:px-10"
        style={{
          background: "#0A0A0A",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <ValtLogo />

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Features
          </a>
          <a
            href="#how"
            className="text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            How it Works
          </a>
        </nav>

        <Link
          href="/signup"
          className="rounded-lg border px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
          style={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          Get Started
        </Link>
      </header>

      {/* ── Hero ── */}
      <section
        className="relative flex min-h-[82vh] items-center overflow-hidden"
        style={{ paddingTop: "80px", paddingBottom: "80px" }}
      >
        {/* Dot grid — right side, fading left */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.13) 1.5px, transparent 1.5px)",
            backgroundSize: "10px 10px",
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.8) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
          <div className="max-w-[580px]">
            {/* Eyebrow */}
            <p
              className="mb-6 text-xs font-medium uppercase tracking-[3px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Link in bio — reimagined
            </p>

            {/* Heading */}
            <h1
              className="font-display font-bold leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                fontSize: "clamp(48px, 7vw, 72px)",
                color: "#fff",
              }}
            >
              Your Links,
              <br />
              Your Identity.
            </h1>

            {/* Subtext */}
            <p
              className="mt-6 max-w-[440px] text-[17px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              A customizable link-in-bio platform with{" "}
              <strong className="font-semibold text-white">
                real analytics
              </strong>
              ,{" "}
              <strong className="font-semibold text-white">theme control</strong>
              , and a space to showcase{" "}
              <strong className="font-semibold text-white">who you are</strong>.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-gray-100"
              >
                Create Your Page &rsaquo;
              </Link>
              <a
                href="#features"
                className="rounded-lg border px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/5"
                style={{ borderColor: "rgba(255,255,255,0.18)" }}
              >
                See Examples
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section
        className="py-10"
        style={{
          background: "#0F0F0F",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <p
            className="text-center text-[11px] font-medium uppercase tracking-[3px]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Trusted By
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {BRANDS.map((brand) => (
              <div
                key={brand}
                className="flex items-center gap-2"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                <Settings2 className="h-3.5 w-3.5" />
                <span className="text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="py-28"
        style={{ background: "#0A0A0A" }}
      >
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          {/* Section header */}
          <div className="mx-auto max-w-xl text-center">
            <h2
              className="font-display text-[36px] font-bold leading-tight"
              style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
            >
              Everything you need
            </h2>
            <p
              className="mt-3 text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              One page. All your links. Built to represent you — not a generic
              template.
            </p>
          </div>

          {/* Cards grid */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="feature-card rounded-2xl p-8"
                style={{
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <f.icon
                  className="h-8 w-8"
                  strokeWidth={1.5}
                  style={{ color: "rgba(255,255,255,0.7)" }}
                />
                <h3 className="mt-5 text-base font-semibold text-white">
                  {f.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how"
        className="py-24"
        style={{
          background: "#111111",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <h2
            className="font-display text-center text-[32px] font-bold"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
          >
            Three steps to live
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up with email or Google. Pick your unique username.",
              },
              {
                step: "02",
                title: "Add your links",
                desc: "Drop in all your important URLs, socials, and upload your CV.",
              },
              {
                step: "03",
                title: "Customize & share",
                desc: "Pick your theme, colors, and fonts. Then share your Valt link.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col">
                <span
                  className="font-display text-4xl font-bold"
                  style={{
                    fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                    color: "rgba(255,255,255,0.1)",
                  }}
                >
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24"
        style={{ background: "#0A0A0A" }}
      >
        <div className="mx-auto max-w-lg px-6 text-center">
          <h2
            className="font-display text-[36px] font-bold leading-tight"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
          >
            Ready to build your page?
          </h2>
          <p
            className="mt-4 text-base"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Free to start. No credit card required.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-sm font-medium text-black transition-all hover:bg-gray-100"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <ValtLogo />
          <p
            className="text-sm"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            © 2025 Valt. All rights reserved.
          </p>
          <nav className="flex gap-6">
            {["Features", "Login", "Sign Up"].map((item) => (
              <Link
                key={item}
                href={
                  item === "Login"
                    ? "/login"
                    : item === "Sign Up"
                    ? "/signup"
                    : "#features"
                }
                className="text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
