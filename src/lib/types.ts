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
  terms_accepted_at?: string | null; // timestamptz
  privacy_accepted_at?: string | null; // timestamptz
  legal_policy_version?: string | null;
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

export interface LegacyProject {
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
  type: "income" | "expense";
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
  // Micronutrients (optional)
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  cholesterol?: number | null;
  saturated_fat?: number | null;
  polyunsaturated_fat?: number | null;
  monounsaturated_fat?: number | null;
  trans_fat?: number | null;
  vitamin_a?: number | null;
  vitamin_c?: number | null;
  vitamin_d?: number | null;
  vitamin_e?: number | null;
  vitamin_k?: number | null;
  thiamin?: number | null;
  riboflavin?: number | null;
  niacin?: number | null;
  vitamin_b6?: number | null;
  folate?: number | null;
  vitamin_b12?: number | null;
  calcium?: number | null;
  iron?: number | null;
  magnesium?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  zinc?: number | null;
  selenium?: number | null;
  // Serving information
  brand?: string | null;
  serving_size?: string | null;
  serving_unit?: string | null;
  fdcId?: number | null;
}

export interface FoodSearchResult {
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  // Micronutrients per 100g (optional)
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  cholesterol_per_100g?: number;
  saturated_fat_per_100g?: number;
  polyunsaturated_fat_per_100g?: number;
  monounsaturated_fat_per_100g?: number;
  trans_fat_per_100g?: number;
  vitamin_a_per_100g?: number;
  vitamin_c_per_100g?: number;
  vitamin_d_per_100g?: number;
  vitamin_e_per_100g?: number;
  vitamin_k_per_100g?: number;
  thiamin_per_100g?: number;
  riboflavin_per_100g?: number;
  niacin_per_100g?: number;
  vitamin_b6_per_100g?: number;
  folate_per_100g?: number;
  vitamin_b12_per_100g?: number;
  calcium_per_100g?: number;
  iron_per_100g?: number;
  magnesium_per_100g?: number;
  phosphorus_per_100g?: number;
  potassium_per_100g?: number;
  zinc_per_100g?: number;
  selenium_per_100g?: number;
  // Metadata
  brand?: string;
  serving_size?: string;
  serving_unit?: string;
  fdcId?: number;
  data_type?: string; // "SR Legacy", "Branded", etc.
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
export type ThoughtType =
  | "anxiety"
  | "distraction"
  | "ego"
  | "negative"
  | "worry"
  | "other";

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

// Win/Loss Journal Types
export interface WinLossEntry {
  id: string;
  user_id: string;
  entry_date: string;
  entry_type: "win" | "loss";
  title: string;
  description: string | null;
  lesson_learned: string | null;
  created_at: string;
  updated_at: string;
}

export interface WinLossInput {
  entry_date: string;
  entry_type: "win" | "loss";
  title: string;
  description?: string;
  lesson_learned?: string;
}

// Energy Log Types
export interface EnergyLog {
  id: string;
  user_id: string;
  log_date: string;
  time_of_day: string;
  energy_level: number;
  task_type: string | null;
  notes: string | null;
  created_at: string;
}

export interface EnergyLogInput {
  log_date: string;
  time_of_day: string;
  energy_level: number;
  task_type?: string;
  notes?: string;
}

// Recharge Activity Types
export interface RechargeActivity {
  id: string;
  user_id: string;
  activity_date: string;
  activity_type:
    | "meditation"
    | "walk"
    | "hobby"
    | "social"
    | "reading"
    | "other";
  duration_minutes: number | null;
  feeling_before: number | null;
  feeling_after: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RechargeActivityInput {
  activity_date: string;
  activity_type:
    | "meditation"
    | "walk"
    | "hobby"
    | "social"
    | "reading"
    | "other";
  duration_minutes?: number;
  feeling_before?: number;
  feeling_after?: number;
  notes?: string;
}

// Decision Journal Types
export interface DecisionJournal {
  id: string;
  user_id: string;
  decision_date: string;
  decision_title: string;
  decision_description?: string;
  options_considered?: string[];
  chosen_option: string;
  reasoning?: string;
  expected_outcome?: string;
  actual_outcome?: string;
  outcome_date?: string;
  lessons_learned?: string;
  created_at: string;
  updated_at: string;
}

export interface DecisionJournalInput {
  decision_date: string;
  decision_title: string;
  decision_description?: string;
  options_considered?: string[];
  chosen_option: string;
  reasoning?: string;
  expected_outcome?: string;
  actual_outcome?: string;
  outcome_date?: string;
  lessons_learned?: string;
}

// Values Check-In Types
export interface ValuesCheckin {
  id: string;
  user_id: string;
  checkin_date: string;
  core_values: string[];
  alignment_score: number;
  aligned_actions?: string;
  misaligned_actions?: string;
  reflection?: string;
  created_at: string;
  updated_at: string;
}

export interface ValuesCheckinInput {
  checkin_date: string;
  core_values: string[];
  alignment_score: number;
  aligned_actions?: string;
  misaligned_actions?: string;
  reflection?: string;
}

// Notion-like Projects Types
export interface Project {
  id: string;
  user_id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  project_id: string;
  parent_folder_id?: string | null;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  user_id: string;
  project_id: string;
  folder_id?: string | null;
  parent_page_id?: string | null;
  title: string;
  content: Record<string, unknown>; // Tiptap JSON content
  widgets?: Array<{ id: string; type: string }>; // Widget configuration
  position: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardPreferences {
  user_id: string;
  widget_order: string[];
  hidden_widgets: string[];
  created_at: string;
  updated_at: string;
}
