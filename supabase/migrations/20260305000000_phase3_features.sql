-- ─────────────────────────────────────────────────────────────────────
-- Phase 3 feature tables: intentions, dimensions, focus, routines,
-- reflections, growth assessments
-- ─────────────────────────────────────────────────────────────────────

-- ── Intentions ───────────────────────────────────────────────────────
create table if not exists public.intentions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  notes         text,
  dimension     text,            -- one of LIFE_DIMENSIONS enum
  context_tags  text[] default '{}',
  scheduled_date date not null default current_date,
  completed_at  timestamptz,
  position      int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.intentions enable row level security;
create policy "Users manage own intentions"
  on public.intentions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index intentions_user_date on public.intentions(user_id, scheduled_date);

-- ── Life dimension scores ─────────────────────────────────────────────
create table if not exists public.life_dimension_scores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  dimension   text not null,
  score       int  not null check (score between 1 and 10),
  week_start  date not null,
  created_at  timestamptz not null default now(),
  unique(user_id, dimension, week_start)
);

alter table public.life_dimension_scores enable row level security;
create policy "Users manage own dimension scores"
  on public.life_dimension_scores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index dim_scores_user_week on public.life_dimension_scores(user_id, week_start);

-- ── Focus sessions ────────────────────────────────────────────────────
create table if not exists public.focus_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  intention_id     uuid references public.intentions(id) on delete set null,
  duration_minutes int  not null check (duration_minutes > 0),
  energy_before    int  check (energy_before between 1 and 5),
  completed        boolean not null default false,
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  created_at       timestamptz not null default now()
);

alter table public.focus_sessions enable row level security;
create policy "Users manage own focus sessions"
  on public.focus_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index focus_user_started on public.focus_sessions(user_id, started_at);

-- ── Routines ──────────────────────────────────────────────────────────
create table if not exists public.routines (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  time_of_day  text not null check (time_of_day in ('morning','afternoon','evening')),
  active       boolean not null default true,
  position     int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.routines enable row level security;
create policy "Users manage own routines"
  on public.routines for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Routine items ─────────────────────────────────────────────────────
create table if not exists public.routine_items (
  id                  uuid primary key default gen_random_uuid(),
  routine_id          uuid not null references public.routines(id) on delete cascade,
  user_id             uuid not null references auth.users(id) on delete cascade,
  title               text not null,
  estimated_minutes   int  default 5,
  position            int  not null default 0
);

alter table public.routine_items enable row level security;
create policy "Users manage own routine items"
  on public.routine_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Routine completions ───────────────────────────────────────────────
create table if not exists public.routine_completions (
  id                   uuid primary key default gen_random_uuid(),
  routine_id           uuid not null references public.routines(id) on delete cascade,
  user_id              uuid not null references auth.users(id) on delete cascade,
  completed_date       date not null default current_date,
  completed_item_ids   uuid[] default '{}',
  unique(routine_id, user_id, completed_date)
);

alter table public.routine_completions enable row level security;
create policy "Users manage own routine completions"
  on public.routine_completions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Reflections ───────────────────────────────────────────────────────
create table if not exists public.reflections (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  content    jsonb,             -- Tiptap JSON document
  mood       text,              -- 'great' | 'good' | 'okay' | 'low' | 'rough'
  entry_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, entry_date)
);

alter table public.reflections enable row level security;
create policy "Users manage own reflections"
  on public.reflections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index reflections_user_date on public.reflections(user_id, entry_date);

-- ── Growth assessments ────────────────────────────────────────────────
create table if not exists public.growth_assessments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  skill       text not null,
  score       int  not null check (score between 1 and 10),
  week_start  date not null,
  created_at  timestamptz not null default now(),
  unique(user_id, skill, week_start)
);

alter table public.growth_assessments enable row level security;
create policy "Users manage own growth assessments"
  on public.growth_assessments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── updated_at triggers ───────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'intentions_updated_at') then
    create trigger intentions_updated_at before update on public.intentions
      for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'routines_updated_at') then
    create trigger routines_updated_at before update on public.routines
      for each row execute function public.set_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'reflections_updated_at') then
    create trigger reflections_updated_at before update on public.reflections
      for each row execute function public.set_updated_at();
  end if;
end $$;
