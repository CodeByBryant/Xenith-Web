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
  preferred_units?: string | null; // 'metric' | 'imperial'
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

// ─── Health & Fitness ────────────────────────────────────────────────

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  exercise_name: string;
  muscle_groups: string[];
  sets: number | null;
  reps: number | null;
  weight_kg: number | null;
  duration_minutes: number | null;
  notes: string | null;
  date: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  date: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export interface Supplement {
  id: string;
  user_id: string;
  name: string;
  dosage?: string | null;
  unit?: string | null;
  notes?: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplementLog {
  id: string;
  user_id: string;
  supplement_id: string;
  date: string;
  taken: boolean;
  logged_at: string;
  created_at: string;
}

export type MealType = 
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "uncategorized"
  | "custom_1"
  | "custom_2"
  | "custom_3"
  | "custom_4";

export interface NutritionLog {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  grams: number;
  created_at: string;
}

export interface FoodSearchResult {
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

// ─── Routines & Intentions ───────────────────────────────────────────

export interface RoutineItem {
  id: string;
  routine_id: string;
  title: string;
  estimated_minutes: number;
  position: number;
}

export interface RoutineWithItems {
  id: string;
  user_id: string;
  name: string;
  time_of_day: "morning" | "afternoon" | "evening";
  active: boolean;
  position: number;
  routine_items?: RoutineItem[];
}

export interface RoutineCompletionLog {
  id: string;
  routine_id: string;
  user_id: string;
  completed_date: string;
  completed_item_ids: string[];
  created_at: string;
}

export type NewIntention = Pick<Intention, "title"> & {
  description?: string;
  scheduled_date?: string;
  dimension?: string | null;
  context_tags?: string[];
};

// ─── Reflections & Mood ──────────────────────────────────────────────

export type Mood = "great" | "good" | "okay" | "low" | "rough";

export interface ReflectionWithMood {
  id: string;
  user_id: string;
  content: Record<string, unknown> | null; // Tiptap JSON
  mood: Mood | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

// ─── Dimension Scores ────────────────────────────────────────────────

export interface DimensionScore {
  id: string;
  user_id: string;
  dimension: LifeDimensionName;
  score: number;
  week_start: string;
  created_at: string;
  updated_at: string;
}

// ─── Biometric & Health Types ────────────────────────────────────────

export type Gender = "male" | "female" | "other";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

export type Goal = "lose_weight" | "maintain" | "gain_muscle";

// ─── Input Types (for mutations) ─────────────────────────────────────

export interface TransactionInput {
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
  date?: string;
}

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  status: "reading" | "completed" | "paused" | "abandoned";
  progress_percent: number;
  total_pages: number | null;
  current_page: number | null;
  rating: number | null;
  key_takeaways: string | null;
  notes: string | null;
  started_date: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookInput {
  title: string;
  author?: string;
  status?: "reading" | "completed" | "paused" | "abandoned";
  progress_percent?: number;
  total_pages?: number;
  current_page?: number;
  rating?: number;
  key_takeaways?: string;
  notes?: string;
  started_date?: string;
  completed_date?: string;
}

export interface SleepLog {
  id: string;
  user_id: string;
  date: string;
  bedtime: string | null;
  wake_time: string | null;
  hours_slept: number | null;
  quality_rating: number | null;
  caffeine_consumed: boolean;
  screen_time_before_bed: boolean;
  exercised_today: boolean;
  stressed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SleepLogInput {
  date: string;
  bedtime?: string;
  wake_time?: string;
  hours_slept?: number;
  quality_rating?: number;
  caffeine_consumed?: boolean;
  screen_time_before_bed?: boolean;
  exercised_today?: boolean;
  stressed?: boolean;
  notes?: string;
}

// Thought Audit Types
export type ThoughtType = 'anxiety' | 'distraction' | 'ego' | 'negative' | 'worry' | 'other';

export interface ThoughtLog {
  id: string;
  user_id: string;
  thought: string;
  type: ThoughtType;
  trigger: string | null;
  response: string | null;
  intensity: number | null;
  logged_at: string;
  created_at: string;
  updated_at: string;
}

export interface ThoughtLogInput {
  thought: string;
  type: ThoughtType;
  trigger?: string;
  response?: string;
  intensity?: number;
  logged_at?: string;
}

// Connection Tracker Types
export interface Connection {
  id: string;
  user_id: string;
  name: string;
  relationship_type: string | null;
  last_contact_date: string | null;
  health_score: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectionInput {
  name: string;
  relationship_type?: string;
  last_contact_date?: string;
  health_score?: number;
  notes?: string;
}

// Gratitude Types
export interface GratitudeEntry {
  id: string;
  user_id: string;
  entry_date: string;
  items: string[];
  created_at: string;
  updated_at: string;
}

export interface GratitudeInput {
  entry_date: string;
  items: string[];
}
