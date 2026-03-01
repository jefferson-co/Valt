"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  ExternalLink,
  FileText,
  Home,
  Link2,
  LogOut,
  Palette,
  Settings,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/links", label: "Links", icon: Link2 },
  { href: "/dashboard/sections", label: "Sections", icon: FileText },
  { href: "/dashboard/socials", label: "Socials", icon: Share2 },
  { href: "/dashboard/appearance", label: "Appearance", icon: Palette },
  { href: "/dashboard/cv", label: "CV", icon: FileText },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  username?: string;
  displayName?: string | null;
}

export function Sidebar({ username, displayName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = (displayName || username || "?")[0].toUpperCase();

  return (
    <aside
      className="flex h-screen w-[260px] shrink-0 flex-col"
      style={{
        background: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-2.5 px-6"
        style={{ borderBottom: "1px solid #E5E7EB" }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect width="22" height="22" rx="5" fill="#111827" />
          <path
            d="M7 8L11 14L15 8"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="text-[17px] font-bold text-[#111827]"
          style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
        >
          Valt
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-[10px] text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F3F4F6] text-[#111827]"
                  : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-[#111827]" : "text-[#9CA3AF]"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — user + logout */}
      <div
        className="p-3"
        style={{ borderTop: "1px solid #E5E7EB" }}
      >
        {/* User identity */}
        {username && (
          <div className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#111827]">
                {displayName || username}
              </p>
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-[#6B7280]"
              >
                /{username}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#F9FAFB] hover:text-[#111827]"
        >
          <LogOut className="h-4 w-4 text-[#9CA3AF]" />
          Log out
        </button>
      </div>
    </aside>
  );
}
