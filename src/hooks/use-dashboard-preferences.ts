import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";

export interface DashboardPreferences {
  widget_order: string[];
  hidden_widgets: string[];
}

const emptyPrefs: DashboardPreferences = {
  widget_order: [],
  hidden_widgets: [],
};

function normalizePreferences(
  raw: Partial<DashboardPreferences> | null | undefined,
  supportedWidgets: string[],
): DashboardPreferences {
  const allowed = new Set(supportedWidgets);

  const providedOrder = Array.isArray(raw?.widget_order)
    ? raw.widget_order.filter((id): id is string => typeof id === "string")
    : [];

  const providedHidden = Array.isArray(raw?.hidden_widgets)
    ? raw.hidden_widgets.filter((id): id is string => typeof id === "string")
    : [];

  const dedupedOrder: string[] = [];
  for (const id of providedOrder) {
    if (allowed.has(id) && !dedupedOrder.includes(id)) dedupedOrder.push(id);
  }

  for (const id of supportedWidgets) {
    if (!dedupedOrder.includes(id)) dedupedOrder.push(id);
  }

  const dedupedHidden: string[] = [];
  for (const id of providedHidden) {
    if (allowed.has(id) && !dedupedHidden.includes(id)) dedupedHidden.push(id);
  }

  return {
    widget_order: dedupedOrder,
    hidden_widgets: dedupedHidden,
  };
}

export function useDashboardPreferences(supportedWidgets: string[]) {
  const { user } = useAuth();
  const [preferences, setPreferences] =
    useState<DashboardPreferences>(emptyPrefs);
  const [isLoading, setIsLoading] = useState(true);

  const widgetsKey = useMemo(
    () => supportedWidgets.join("|"),
    [supportedWidgets],
  );

  const storageKey = useMemo(
    () => `xenith_dashboard_prefs:${user?.id ?? "guest"}`,
    [user?.id],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      let raw: Partial<DashboardPreferences> | null = null;

      if (user?.id && supabase) {
        const { data, error } = await supabase
          .from("dashboard_preferences")
          .select("widget_order, hidden_widgets")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data) {
          raw = {
            widget_order: data.widget_order,
            hidden_widgets: data.hidden_widgets,
          };
        }
      }

      if (!raw) {
        try {
          const fromStorage = localStorage.getItem(storageKey);
          if (fromStorage) {
            raw = JSON.parse(fromStorage) as DashboardPreferences;
          }
        } catch {
          raw = null;
        }
      }

      if (!cancelled) {
        setPreferences(normalizePreferences(raw, supportedWidgets));
        setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [storageKey, supportedWidgets, widgetsKey, user?.id]);

  const persist = useCallback(
    async (next: DashboardPreferences) => {
      const normalized = normalizePreferences(next, supportedWidgets);
      setPreferences(normalized);

      try {
        localStorage.setItem(storageKey, JSON.stringify(normalized));
      } catch {
        // Ignore local storage write failures.
      }

      if (user?.id && supabase) {
        await supabase.from("dashboard_preferences").upsert(
          {
            user_id: user.id,
            widget_order: normalized.widget_order,
            hidden_widgets: normalized.hidden_widgets,
          },
          { onConflict: "user_id" },
        );
      }
    },
    [storageKey, supportedWidgets, user?.id],
  );

  const reorderWidgets = useCallback(
    async (nextOrder: string[]) => {
      await persist({
        widget_order: nextOrder,
        hidden_widgets: preferences.hidden_widgets,
      });
    },
    [persist, preferences.hidden_widgets],
  );

  const setWidgetVisible = useCallback(
    async (widgetId: string, visible: boolean) => {
      const hiddenSet = new Set(preferences.hidden_widgets);
      if (visible) {
        hiddenSet.delete(widgetId);
      } else {
        hiddenSet.add(widgetId);
      }

      await persist({
        widget_order: preferences.widget_order,
        hidden_widgets: Array.from(hiddenSet),
      });
    },
    [persist, preferences.hidden_widgets, preferences.widget_order],
  );

  const resetPreferences = useCallback(async () => {
    await persist({
      widget_order: supportedWidgets,
      hidden_widgets: [],
    });
  }, [persist, supportedWidgets]);

  return {
    preferences,
    isLoading,
    reorderWidgets,
    setWidgetVisible,
    resetPreferences,
  };
}
