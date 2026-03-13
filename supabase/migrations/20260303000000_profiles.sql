-- ─── Profiles table ───────────────────────────────────────────────────
-- Mirrors the Profile interface in src/lib/types.ts.
-- A row is automatically created for every new auth.users insert
-- via the handle_new_user() trigger.

create table if not exists public.profiles (
  id                    uuid        primary key references auth.users(id) on delete cascade,
  name                  text,
  avatar_url            text,
  bio                   text,
  theme                 text        not null default 'dark',
  focus_style           text,
  notifications_enabled boolean     not null default true,
  notification_time     time,
  timezone              text        not null default 'America/New_York',
  data_sharing_consent  boolean     not null default false,
  onboarding_completed  boolean     not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  last_active_at        timestamptz
);

-- ─── Row-level security ───────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Users can read only their own profile
create policy "profiles: own read"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update only their own profile
create policy "profiles: own update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Service role can insert (used by the trigger below)
create policy "profiles: service insert"
  on public.profiles for insert
  with check (true);

-- ─── Auto-update updated_at ───────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─── Auto-create profile on signup ───────────────────────────────────
-- Fires after a new row is inserted into auth.users.
-- Pulls name + avatar from the OAuth provider metadata when available.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, avatar_url, timezone)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'timezone', 'America/New_York')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
