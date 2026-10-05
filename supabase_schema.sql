-- =========================================================================
-- BANGALORE BIBLECLUB - SUPABASE SCHEMA SETUP
-- Paste this script into your Supabase SQL Editor and click "RUN"
-- =========================================================================

-- 1. Create table for reading posts
create table if not exists public.reading_posts (
  id text primary key,
  user_id text not null,
  user_name text not null,
  user_avatar text,
  start_photo_url text,
  end_photo_url text,
  book_id text not null,
  book_name text not null,
  start_chapter int not null,
  start_verse int not null,
  end_chapter int not null,
  end_verse int not null,
  chapters_count int default 1,
  duration_minutes int default 15,
  reflection text,
  reactions jsonb default '{}'::jsonb,
  comments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create table for prayer requests
create table if not exists public.prayer_requests (
  id text primary key,
  user_id text not null,
  user_name text not null,
  user_avatar text,
  is_anonymous boolean default false,
  title text not null,
  description text not null,
  praying_user_ids text[] default '{}'::text[],
  is_answered boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create table for user progress & leaderboards
create table if not exists public.user_progress (
  user_id text primary key,
  user_name text not null,
  user_avatar text,
  completed_chapters jsonb default '{}'::jsonb,
  streak_days int default 0,
  last_read_date text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create table for verse questions & answers
create table if not exists public.verse_questions (
  id text primary key,
  user_id text not null,
  user_name text not null,
  user_avatar text,
  verse_reference text not null,
  book_id text not null,
  question_text text not null,
  context_note text,
  upvotes text[] default '{}'::text[],
  answers jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS) with full public access for group circle
alter table public.reading_posts enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.user_progress enable row level security;
alter table public.verse_questions enable row level security;

-- Policies for public reading circle access
create policy "Allow all reading_posts" on public.reading_posts for all using (true) with check (true);
create policy "Allow all prayer_requests" on public.prayer_requests for all using (true) with check (true);
create policy "Allow all user_progress" on public.user_progress for all using (true) with check (true);
create policy "Allow all verse_questions" on public.verse_questions for all using (true) with check (true);

-- 6. Enable Realtime Replication so all friends get instant live updates
alter publication supabase_realtime add table public.reading_posts;
alter publication supabase_realtime add table public.prayer_requests;
alter publication supabase_realtime add table public.user_progress;
alter publication supabase_realtime add table public.verse_questions;

-- 7. Create storage bucket for reading photos
insert into storage.buckets (id, name, public)
values ('reading-photos', 'reading-photos', true)
on conflict (id) do nothing;

create policy "Public Access to Reading Photos"
on storage.objects for all
using (bucket_id = 'reading-photos')
with check (bucket_id = 'reading-photos');
