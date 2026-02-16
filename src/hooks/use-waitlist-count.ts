import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Fetches the live waitlist count from Supabase.
 * Falls back to localStorage count when Supabase is not configured.
 * Refreshes every 30 seconds.
 */
export function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { count: total, error } = await supabase
            .from("waitlist")
            .select("*", { count: "exact", head: true });

          if (!error && total !== null && !cancelled) {
            setCount(total);
          }
        } else {
          // localStorage fallback for dev
          const existing = JSON.parse(
            localStorage.getItem("xenith_waitlist") || "[]",
          );
          if (!cancelled) setCount(existing.length);
        }
      } catch {
        // silently fail — count stays null
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { count, loading };
}
