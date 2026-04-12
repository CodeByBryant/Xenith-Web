import { useEffect, useRef, startTransition } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { hasCompletedOnboarding } from "@/lib/onboarding";

/**
 * Landing page for Supabase OAuth redirects and magic-link clicks.
 * Supabase handles the token in the URL automatically when detectSessionInUrl
 * is true (set in supabase.ts). We just wait for the session to be ready,
 * then route the user to onboarding (first time) or the app (returning).
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    const client = supabase;
    if (handled.current || !client) return;
    handled.current = true;

    const resolve = async () => {
      try {
        // Give Supabase a moment to exchange the code / process the magic-link
        const { data, error } = await client.auth.getSession();

        if (error || !data.session) {
          toast.error("Authentication failed. Please try again.");
          startTransition(() => navigate("/signin", { replace: true }));
          return;
        }

        // Check if the user has completed onboarding
        // Only redirect to onboarding for new users (SIGNED_UP event)
        // Falls back to localStorage if the profiles table doesn't exist yet
        const localOnboardingComplete =
          localStorage.getItem("xenith_onboarding_complete") === "1";
        let profileOnboardingCompleted: boolean | null | undefined;
        
        try {
          const { data: profile } = await client
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", data.session.user.id)
            .single();
          profileOnboardingCompleted = profile?.onboarding_completed;
        } catch {
          // table/column doesn't exist yet — rely on localStorage flag
        }

        const onboardingComplete = hasCompletedOnboarding(
          profileOnboardingCompleted,
          localOnboardingComplete,
        );

        if (onboardingComplete) {
          localStorage.setItem("xenith_onboarding_complete", "1");
        }

        // Only redirect new users to onboarding
        if (!onboardingComplete) {
          startTransition(() => navigate("/onboarding", { replace: true }));
        } else {
          startTransition(() => navigate("/app", { replace: true }));
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
        startTransition(() => navigate("/signin", { replace: true }));
      }
    };

    // Listen for auth state change as a fallback
    // SIGNED_IN fires for both sign-up and sign-in, so we check onboarding status
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        subscription.unsubscribe();
        resolve();
      }
    });

    // Also try immediately in case the session is already set
    resolve().catch(() => {});

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>Signing In — Xenith</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://xenith.life/auth/callback" />
      </Helmet>

      <div className="flex flex-col items-center gap-4">
        <span className="font-chomsky text-4xl text-foreground animate-pulse">
          X
        </span>
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}
