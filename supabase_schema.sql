-- ============================================================
-- Board 앱 Supabase 스키마 설정
-- Supabase 대시보드 > SQL Editor 에서 실행하세요
-- ============================================================

-- 1. profiles 테이블
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  email text,
  created_at timestamptz default now() not null
);

-- 2. posts 테이블
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. comments 테이블
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- ============================================================
-- Row Level Security (RLS) 설정
-- ============================================================

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- profiles 정책
create policy "누구나 프로필 조회 가능" on public.profiles
  for select using (true);

create policy "본인만 프로필 수정 가능" on public.profiles
  for update using (auth.uid() = id);

create policy "본인만 프로필 생성 가능" on public.profiles
  for insert with check (auth.uid() = id);

-- posts 정책
create policy "누구나 게시글 조회 가능" on public.posts
  for select using (true);

create policy "로그인 사용자만 게시글 작성 가능" on public.posts
  for insert with check (auth.uid() = user_id);

create policy "본인만 게시글 수정 가능" on public.posts
  for update using (auth.uid() = user_id);

create policy "본인만 게시글 삭제 가능" on public.posts
  for delete using (auth.uid() = user_id);

-- comments 정책
create policy "누구나 댓글 조회 가능" on public.comments
  for select using (true);

create policy "로그인 사용자만 댓글 작성 가능" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "본인만 댓글 삭제 가능" on public.comments
  for delete using (auth.uid() = user_id);

-- ============================================================
-- updated_at 자동 업데이트 트리거
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 신규 사용자 가입 시 profiles 자동 생성 트리거
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
