
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- lectures (public catalog)
create table public.lectures (
  id uuid primary key default gen_random_uuid(),
  position int not null unique,
  video_id text not null unique,
  title text not null,
  duration text,
  created_at timestamptz not null default now()
);

alter table public.lectures enable row level security;

create policy "Lectures are viewable by everyone"
  on public.lectures for select
  to anon, authenticated
  using (true);

-- lecture_progress
create table public.lecture_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lecture_id uuid not null references public.lectures(id) on delete cascade,
  completed boolean not null default false,
  watched_seconds int not null default 0,
  last_watched_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lecture_id)
);

alter table public.lecture_progress enable row level security;

create policy "Users view own progress"
  on public.lecture_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own progress"
  on public.lecture_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.lecture_progress for update
  using (auth.uid() = user_id);

create policy "Users delete own progress"
  on public.lecture_progress for delete
  using (auth.uid() = user_id);

create index lecture_progress_user_idx on public.lecture_progress(user_id);
create index lecture_progress_lecture_idx on public.lecture_progress(lecture_id);

-- updated_at helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger progress_touch before update on public.lecture_progress
  for each row execute function public.touch_updated_at();
