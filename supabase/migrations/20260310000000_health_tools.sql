-- ─────────────────────────────────────────────────────────────────────
-- Phase 4: Health Dimension deep tools
-- Tables: nutrition_logs, workout_logs
-- ─────────────────────────────────────────────────────────────────────

-- ── Nutrition logs ────────────────────────────────────────────────────
create table if not exists public.nutrition_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null default current_date,
  meal_type   text not null check (meal_type in ('breakfast','lunch','dinner','snack')),
  food_name   text not null,
  calories    int  not null default 0,
  protein     numeric(6,1) not null default 0,
  carbs       numeric(6,1) not null default 0,
  fat         numeric(6,1) not null default 0,
  grams       int  not null default 100,
  created_at  timestamptz not null default now()
);

alter table public.nutrition_logs enable row level security;
create policy "Users manage own nutrition logs"
  on public.nutrition_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index nutrition_user_date on public.nutrition_logs(user_id, date);

-- ── Workout logs ──────────────────────────────────────────────────────
create table if not exists public.workout_logs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  date             date not null default current_date,
  exercise_name    text not null,
  muscle_groups    text[] not null default '{}',
  sets             int,
  reps             int,
  weight_kg        numeric(6,1),
  duration_minutes int,
  notes            text,
  created_at       timestamptz not null default now()
);

alter table public.workout_logs enable row level security;
create policy "Users manage own workout logs"
  on public.workout_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index workout_user_date on public.workout_logs(user_id, date);
