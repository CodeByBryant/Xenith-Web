-- ═══════════════════════════════════════════════════════════════════════
-- Biometric Data & Calorie Targets
-- ═══════════════════════════════════════════════════════════════════════

-- Add biometric fields to profiles
alter table public.profiles
add column if not exists age integer,
add column if not exists gender text,
add column if not exists height_cm numeric(5,1),
add column if not exists weight_kg numeric(5,1),
add column if not exists activity_level text,
add column if not exists goal text,
add column if not exists bmr numeric(6,1),
add column if not exists tdee numeric(6,1),
add column if not exists target_calories integer,
add column if not exists target_protein numeric(5,1),
add column if not exists target_carbs numeric(5,1),
add column if not exists target_fat numeric(5,1);

-- Add check constraints
alter table public.profiles
add constraint profiles_gender_check 
  check (gender in ('male', 'female', 'other') or gender is null);

alter table public.profiles
add constraint profiles_activity_level_check 
  check (activity_level in ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active') or activity_level is null);

alter table public.profiles
add constraint profiles_goal_check 
  check (goal in ('lose_weight', 'maintain', 'gain_muscle') or goal is null);
