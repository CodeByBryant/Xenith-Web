import { useWaitlistCountContext } from "@/context/WaitlistCountContext";

/**
 * Returns the shared waitlist count from the singleton polling loop.
 * All consumers share one interval and one Supabase call (via WaitlistCountProvider).
 */
export function useWaitlistCount() {
  return useWaitlistCountContext();
 * Fetches the live waitlist count from Supabase.
 * Uses the `get_waitlist_count` RPC so the anon role never needs direct
 * SELECT access on the waitlist table (which would expose user emails).
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

  return { count, loading };
}
