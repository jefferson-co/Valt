export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  created_at: string;
};

export type Link = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  position: number;
  clicks: number;
  is_active: boolean;
  created_at: string;
};

export type Social = {
  id: string;
  user_id: string;
  platform: "x" | "linkedin" | "instagram";
  url: string;
};

export type Section = {
  id: string;
  user_id: string;
  title: string;
  position: number;
};

export type Theme = {
  id: string;
  user_id: string;
  bg_color: string;
  bg_gradient: string | null;
  button_style: "rounded" | "pill" | "sharp" | "outline";
  button_color: string;
  button_text_color: string;
  font_primary: string;
  font_secondary: string;
  icon_style: "outlined" | "filled" | "minimal";
};

export type AnalyticsEvent = {
  id: string;
  user_id: string;
  link_id: string | null;
  event_type: "page_view" | "link_click" | "cv_download";
  referrer: string | null;
  created_at: string;
};
