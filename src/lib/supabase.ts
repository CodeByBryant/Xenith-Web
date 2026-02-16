import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

/**
 * Whether Supabase is configured with valid-looking credentials.
 * Use this to gracefully fall back to local storage in development.
 */
export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseAnonKey.length > 20;

/**
 * Supabase client instance.
 *
 * Only created when env vars are present. When unconfigured,
 * `supabase` is null and the waitlist form falls back to localStorage.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// ─── Database types ──────────────────────────────────────────────────
// All types live in @/lib/types.ts — re-export waitlist for convenience.
export type { WaitlistEntry } from "@/lib/types";
