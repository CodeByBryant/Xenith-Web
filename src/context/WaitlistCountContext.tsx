import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface WaitlistCountContextValue {
  count: number | null;
  loading: boolean;
}

const WaitlistCountContext = createContext<WaitlistCountContextValue | undefined>(
  undefined,
);

/**
 * Provides a single shared polling loop for the waitlist count.
 * All consumers of `useWaitlistCount` share one interval and one Supabase call.
 */
export function WaitlistCountProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: total, error } = await supabase.rpc(
            "get_waitlist_count",
          );

          if (!error && total !== null && !cancelled) {
            setCount(Number(total));
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

  return (
    <WaitlistCountContext.Provider value={{ count, loading }}>
      {children}
    </WaitlistCountContext.Provider>
  );
}

export function useWaitlistCountContext(): WaitlistCountContextValue {
  const ctx = useContext(WaitlistCountContext);
  if (!ctx) {
    throw new Error(
      "useWaitlistCountContext (or useWaitlistCount) must be used within a WaitlistCountProvider",
    );
  }
  return ctx;
}
