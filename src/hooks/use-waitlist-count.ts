import { useWaitlistCountContext } from "@/context/WaitlistCountContext";

/**
 * Returns the shared waitlist count from the singleton polling loop.
 * All consumers share one interval and one Supabase call (via WaitlistCountProvider).
 */
export function useWaitlistCount() {
  return useWaitlistCountContext();
}
