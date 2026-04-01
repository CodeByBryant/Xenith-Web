// ─── Centralized Supabase Database Types ─────────────────────────────
// These mirror the actual Supabase table schemas.
// Regenerate with `supabase gen types typescript` when the schema changes.
// ──────────────────────────────────────────────────────────────────────

export interface Profile {
  id: string; // uuid (pk, fk -> auth.users.id)
  name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  theme?: string | null; // default 'dark'
  focus_style?: string | null;
  notifications_enabled?: boolean | null; // default true
  notification_time?: string | null; // time (HH:MM:SS)
  timezone?: string | null; // default 'America/New_York'
  data_sharing_consent?: boolean | null; // default false
  custom_meal_1?: string | null;
  custom_meal_2?: string | null;
  custom_meal_3?: string | null;
  custom_meal_4?: string | null;
  age?: number | null;
  gender?: string | null; // 'male' | 'female' | 'other'
  height_cm?: number | null;
  weight_kg?: number | null;
  activity_level?: string | null; // 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
  goal?: string | null; // 'lose_weight' | 'maintain' | 'gain_muscle'
  bmr?: number | null;
  tdee?: number | null;
  target_calories?: number | null;
  target_protein?: number | null;
  target_carbs?: number | null;
  target_fat?: number | null;
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
  last_active_at?: string | null; // timestamptz
}

export interface Project {
  id: string; // uuid
  user_id: string; // uuid (fk -> auth.users.id)
  title?: string | null;
  description?: string | null;
  content?: Record<string, unknown> | null; // jsonb
  parent_id?: string | null; // uuid (self fk)
  icon?: string | null;
  cover_image_url?: string | null;
  properties?: Record<string, unknown> | null; // jsonb
  status?: string | null; // default 'active'
  position?: number | null; // default 0
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

export interface Intention {
  id: string; // uuid
  user_id: string; // uuid (fk -> auth.users.id)
  title?: string | null;
  description?: string | null;
  notes?: Record<string, unknown> | null; // jsonb
  parent_id?: string | null; // uuid (self fk)
  project_id?: string | null; // uuid (fk -> projects.id)
  context_tags?: string[] | null; // text[]
  due_date?: string | null; // timestamptz
  scheduled_date?: string | null; // date (YYYY-MM-DD)
  estimated_minutes?: number | null;
  reminder_time?: string | null; // time (HH:MM:SS)
  reminder_enabled?: boolean | null; // default false
  completed_at?: string | null; // timestamptz
  archived_at?: string | null; // timestamptz
  position?: number | null; // default 0
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

export interface LifeDimension {
  id: string; // uuid
  user_id: string; // uuid (fk -> auth.users.id)
  dimension?: string | null;
  rating?: number | null; // integer 1..10
  notes?: string | null;
  recorded_at?: string | null; // timestamptz
}

export interface Routine {
  id: string; // uuid
  user_id: string; // uuid (fk -> auth.users.id)
  title?: string | null;
  description?: string | null;
  checklist?: Record<string, unknown> | null; // jsonb
  time_of_day?: string | null;
  days_of_week?: number[] | null; // int4[]
  active?: boolean | null; // default true
  created_at?: string | null; // timestamptz
  updated_at?: string | null; // timestamptz
}

export interface RoutineCompletion {
  id: string; // uuid
  routine_id: string; // uuid (fk -> routines.id)
  user_id: string; // uuid (fk -> auth.users.id)
  completed_at?: string | null; // timestamptz
  completed_items?: number[] | null; // int4[]
  notes?: string | null;
}

export interface FocusSession {
  id: string; // uuid
  user_id: string; // uuid (fk -> auth.users.id)
  intention_id?: string | null; // uuid (fk -> intentions.id)
  project_id?: string | null; // uuid (fk -> projects.id)
  duration_minutes: number; // integer
  session_type?: string | null;
  energy_before?: number | null; // integer 1..10
  energy_after?: number | null; // integer 1..10
  distractions?: number | null; // integer, default 0
  distraction_notes?: string | null;
  notes?: string | null;
  started_at?: string | null; // timestamptz
  completed_at?: string | null; // timestamptz
  created_at?: string | null; // timestamptz
}

export interface Reflection {
  id: string; // uuid
  user_id: string; // uuid (fk -> auth.users.id)
  reflection_type?: string | null;
  prompt?: string | null;
  content?: string | null;
  is_private?: boolean | null; // default true
  created_at?: string | null; // timestamptz
}

export interface WaitlistEntry {
  id?: string; // uuid
  email: string;
  referral_code?: string | null;
  referred_by?: string | null;
  created_at?: string | null; // timestamptz
  converted_at?: string | null; // timestamptz
  source?: string | null;
  utm_campaign?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
}

// ─── Canonical dimension names ───────────────────────────────────────
// Use these everywhere to avoid naming drift between screens.
export const LIFE_DIMENSIONS = [
  "Health",
  "Mind",
  "Relationships",
  "Work",
  "Finances",
  "Learning",
  "Rest",
  "Purpose",
] as const;

export type LifeDimensionName = (typeof LIFE_DIMENSIONS)[number];
