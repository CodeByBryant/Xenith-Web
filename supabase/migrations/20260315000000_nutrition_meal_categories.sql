-- ═══════════════════════════════════════════════════════════════════════
-- Nutrition: Meal Categories Enhancement
-- ═══════════════════════════════════════════════════════════════════════
-- Adds: 
-- - Custom meal categories (4 slots)
-- - Uncategorized option
-- - User preferences for custom category names

-- ── Add custom meal category columns to profiles ──────────────────────
alter table public.profiles
add column if not exists custom_meal_1 text,
add column if not exists custom_meal_2 text,
add column if not exists custom_meal_3 text,
add column if not exists custom_meal_4 text;

-- ── Update nutrition_logs meal_type constraint ─────────────────────────
-- Drop existing constraint
alter table public.nutrition_logs
drop constraint if exists nutrition_logs_meal_type_check;

-- Add new constraint with extended options
alter table public.nutrition_logs
add constraint nutrition_logs_meal_type_check
check (meal_type in (
  'breakfast', 
  'lunch', 
  'dinner', 
  'snack', 
  'uncategorized',
  'custom_1',
  'custom_2',
  'custom_3',
  'custom_4'
));
