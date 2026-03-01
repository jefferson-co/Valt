-- ============================================
-- Valt — Full Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (Phase 1)
-- ============================================
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  cv_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);
create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- ============================================
-- LINKS (Phase 2)
-- ============================================
create table if not exists links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  position int not null default 0,
  clicks int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

alter table links enable row level security;

create policy "Public links are viewable by everyone"
  on links for select using (true);
create policy "Users can insert their own links"
  on links for insert with check (auth.uid() = user_id);
create policy "Users can update their own links"
  on links for update using (auth.uid() = user_id);
create policy "Users can delete their own links"
  on links for delete using (auth.uid() = user_id);

-- ============================================
-- SOCIALS (Phase 2)
-- ============================================
create table if not exists socials (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  platform text not null check (platform in ('x', 'linkedin', 'instagram')),
  url text not null
);

alter table socials enable row level security;

create policy "Public socials are viewable by everyone"
  on socials for select using (true);
create policy "Users can insert their own socials"
  on socials for insert with check (auth.uid() = user_id);
create policy "Users can update their own socials"
  on socials for update using (auth.uid() = user_id);
create policy "Users can delete their own socials"
  on socials for delete using (auth.uid() = user_id);

-- ============================================
-- SECTIONS (Phase 2)
-- ============================================
create table if not exists sections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  position int not null default 0
);

alter table sections enable row level security;

create policy "Public sections are viewable by everyone"
  on sections for select using (true);
create policy "Users can insert their own sections"
  on sections for insert with check (auth.uid() = user_id);
create policy "Users can update their own sections"
  on sections for update using (auth.uid() = user_id);
create policy "Users can delete their own sections"
  on sections for delete using (auth.uid() = user_id);

-- ============================================
-- THEMES (Phase 3)
-- ============================================
create table if not exists themes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  bg_color text not null default '#ffffff',
  bg_gradient text,
  button_style text not null default 'rounded' check (button_style in ('rounded', 'pill', 'sharp', 'outline')),
  button_color text not null default '#6366f1',
  button_text_color text not null default '#ffffff',
  font_primary text not null default 'DM Sans',
  font_secondary text not null default 'DM Sans',
  icon_style text not null default 'outlined' check (icon_style in ('outlined', 'filled', 'minimal'))
);

alter table themes enable row level security;

create policy "Public themes are viewable by everyone"
  on themes for select using (true);
create policy "Users can insert their own theme"
  on themes for insert with check (auth.uid() = user_id);
create policy "Users can update their own theme"
  on themes for update using (auth.uid() = user_id);

-- ============================================
-- ANALYTICS (Phase 5)
-- ============================================
create table if not exists analytics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  link_id uuid references links(id) on delete set null,
  event_type text not null check (event_type in ('page_view', 'link_click', 'cv_download')),
  referrer text,
  created_at timestamptz default now()
);

alter table analytics enable row level security;

create policy "Analytics are viewable by the owner"
  on analytics for select using (auth.uid() = user_id);
create policy "Anyone can insert analytics"
  on analytics for insert with check (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Create these in the Supabase Dashboard:
-- 1. "avatars" bucket (public)
-- 2. "cv-files" bucket (public)
