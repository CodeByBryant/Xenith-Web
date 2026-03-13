import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as
  | string
  | undefined;

/**
 * Whether Supabase is configured with valid-looking credentials.
 * Use this to gracefully fall back to local storage in development.
 */
export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabasePublishableKey &&
  supabaseUrl.startsWith("https://") &&
  supabasePublishableKey.length > 20;

/**
 * Supabase client instance.
 *
 * Only created when env vars are present. When unconfigured,
 * `supabase` is null and the waitlist form falls back to localStorage.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// ─── Database types ──────────────────────────────────────────────────
// All types live in @/lib/types.ts — re-export waitlist for convenience.
export type { WaitlistEntry } from "@/lib/types";
