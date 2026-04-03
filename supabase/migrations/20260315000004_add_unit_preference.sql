-- Add unit preference to profiles
alter table public.profiles
add column if not exists preferred_units text default 'metric';

alter table public.profiles
add constraint profiles_preferred_units_check 
  check (preferred_units in ('metric', 'imperial') or preferred_units is null);
