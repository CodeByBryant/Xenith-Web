-- ═══════════════════════════════════════════════════════════════════════
-- Water & Supplements Tracking
-- ═══════════════════════════════════════════════════════════════════════

-- ── Water logs ─────────────────────────────────────────────────────────
create table if not exists public.water_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null default current_date,
  amount_ml   int  not null,
  logged_at   timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

alter table public.water_logs enable row level security;

create policy "Users manage own water logs"
  on public.water_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index water_user_date on public.water_logs(user_id, date);

-- ── Supplements ────────────────────────────────────────────────────────
-- Master list of supplements the user takes
create table if not exists public.supplements (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  dosage        text,
  unit          text,
  notes         text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.supplements enable row level security;

create policy "Users manage own supplements"
  on public.supplements for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index supplements_user on public.supplements(user_id);

-- ── Supplement logs ────────────────────────────────────────────────────
-- Daily tracking of supplement intake
create table if not exists public.supplement_logs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  supplement_id  uuid not null references public.supplements(id) on delete cascade,
  date           date not null default current_date,
  taken          boolean not null default true,
  logged_at      timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

alter table public.supplement_logs enable row level security;

create policy "Users manage own supplement logs"
  on public.supplement_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index supplement_logs_user_date on public.supplement_logs(user_id, date);
create index supplement_logs_supplement on public.supplement_logs(supplement_id);
