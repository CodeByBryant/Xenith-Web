/**
 * Xenith REST API Layer
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin wrapper around Supabase for all feature CRUD.
 * Designed for easy consumption by an AI Coach agent that needs full
 * read/write access to every user feature.
 *
 * Usage:
 *   import { api } from "@/lib/api";
 *   const { data } = await api.intentions.list({ userId, date: "2026-03-09" });
 *
 * All methods return { data, error } — never throw.
 * All mutating methods accept a `userId` so the AI Coach can act on behalf
 * of the authenticated user after verifying auth.uid() server-side (RLS).
 */

import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ApiResult<T> = Promise<{ data: T | null; error: string | null }>;

function ok<T>(data: T): { data: T; error: null } {
  return { data, error: null };
}
function err(e: unknown): { data: null; error: string } {
  const msg = e instanceof Error ? e.message : String(e);
  return { data: null, error: msg };
}

// ── Guard ─────────────────────────────────────────────────────────────────────

function guard(): { data: null; error: string } | null {
  if (!supabase) return { data: null, error: "Supabase not initialised" };
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTENTIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface IntentionInput {
  title: string;
  dimension?: string | null;
  scheduled_date?: string | null; // YYYY-MM-DD
}

export const intentionsApi = {
  /** List intentions for a given date (defaults today). */
  async list(userId: string, date?: string): ApiResult<object[]> {
    const g = guard();
    if (g) return g;
    const scheduled_date = date ?? new Date().toISOString().split("T")[0];
    const { data, error } = await supabase!
      .from("intentions")
      .select("*")
      .eq("user_id", userId)
      .eq("scheduled_date", scheduled_date)
      .order("created_at");
    return error ? err(error) : ok(data ?? []);
  },

  /** Create a new intention. */
  async create(userId: string, input: IntentionInput): ApiResult<object> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("intentions")
      .insert({
        user_id: userId,
        title: input.title,
        dimension: input.dimension ?? null,
        scheduled_date:
          input.scheduled_date ?? new Date().toISOString().split("T")[0],
      })
      .select()
      .single();
    return error ? err(error) : ok(data);
  },

  /** Toggle completion on an intention. */
  async complete(
    userId: string,
    id: string,
    completed: boolean,
  ): ApiResult<object> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("intentions")
      .update({ completed_at: completed ? new Date().toISOString() : null })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    return error ? err(error) : ok(data);
  },

  /** Delete an intention. */
  async delete(userId: string, id: string): ApiResult<null> {
    const g = guard();
    if (g) return g;
    const { error } = await supabase!
      .from("intentions")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    return error ? err(error) : ok(null);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LIFE DIMENSIONS
// ─────────────────────────────────────────────────────────────────────────────

export const dimensionsApi = {
  /** Get scores for the past N weeks. */
  async list(userId: string, weeksBack = 4): ApiResult<object[]> {
    const g = guard();
    if (g) return g;
    const oldest = (() => {
      const d = new Date();
      d.setDate(d.getDate() - weeksBack * 7);
      const day = d.getDay();
      d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
      return d.toISOString().split("T")[0];
    })();
    const { data, error } = await supabase!
      .from("life_dimension_scores")
      .select("*")
      .eq("user_id", userId)
      .gte("week_start", oldest)
      .order("week_start", { ascending: false });
    return error ? err(error) : ok(data ?? []);
  },

  /** Upsert scores for the current week. scores = { dimension: score } */
  async saveWeek(
    userId: string,
    scores: Record<string, number>,
  ): ApiResult<null> {
    const g = guard();
    if (g) return g;
    const now = new Date();
    const day = now.getDay();
    now.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
    const week_start = now.toISOString().split("T")[0];
    const rows = Object.entries(scores).map(([dimension, score]) => ({
      user_id: userId,
      dimension,
      score,
      week_start,
    }));
    const { error } = await supabase!
      .from("life_dimension_scores")
      .upsert(rows, { onConflict: "user_id,dimension,week_start" });
    return error ? err(error) : ok(null);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FOCUS SESSIONS
// ─────────────────────────────────────────────────────────────────────────────

export const focusApi = {
  /** List all sessions (most recent first). */
  async list(userId: string): ApiResult<object[]> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("focus_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });
    return error ? err(error) : ok(data ?? []);
  },

  /** Start a new focus session. */
  async start(
    userId: string,
    opts: {
      duration_minutes: number;
      energy_before?: number;
      intention_id?: string;
    },
  ): ApiResult<object> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("focus_sessions")
      .insert({
        user_id: userId,
        duration_minutes: opts.duration_minutes,
        energy_before: opts.energy_before ?? null,
        intention_id: opts.intention_id ?? null,
        started_at: new Date().toISOString(),
        completed: false,
      })
      .select()
      .single();
    return error ? err(error) : ok(data);
  },

  /** Mark a session complete. */
  async complete(userId: string, sessionId: string): ApiResult<object> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("focus_sessions")
      .update({ completed: true, ended_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", userId)
      .select()
      .single();
    return error ? err(error) : ok(data);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTINES
// ─────────────────────────────────────────────────────────────────────────────

export const routinesApi = {
  /** List all routines with their items. */
  async list(userId: string): ApiResult<object[]> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("routines")
      .select("*, routine_items(*)")
      .eq("user_id", userId)
      .order("created_at");
    return error ? err(error) : ok(data ?? []);
  },

  /** Create a routine. */
  async create(
    userId: string,
    opts: { name: string; time_of_day: string },
  ): ApiResult<object> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("routines")
      .insert({
        user_id: userId,
        name: opts.name,
        time_of_day: opts.time_of_day,
      })
      .select()
      .single();
    return error ? err(error) : ok(data);
  },

  /** Add a step to a routine. */
  async addItem(opts: {
    routine_id: string;
    title: string;
    estimated_minutes?: number;
  }): ApiResult<object> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("routine_items")
      .insert({
        routine_id: opts.routine_id,
        title: opts.title,
        estimated_minutes: opts.estimated_minutes ?? 0,
      })
      .select()
      .single();
    return error ? err(error) : ok(data);
  },

  /** Toggle item completion for today. */
  async toggleItem(
    userId: string,
    routineId: string,
    itemId: string,
    checked: boolean,
  ): ApiResult<null> {
    const g = guard();
    if (g) return g;
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase!
      .from("routine_completions")
      .select("id, completed_item_ids")
      .eq("routine_id", routineId)
      .eq("user_id", userId)
      .gte("completed_at", today)
      .maybeSingle();
    const prev: string[] = (existing?.completed_item_ids as string[]) ?? [];
    const next = checked
      ? [...new Set([...prev, itemId])]
      : prev.filter((x) => x !== itemId);
    if (existing) {
      const { error } = await supabase!
        .from("routine_completions")
        .update({ completed_item_ids: next })
        .eq("id", existing.id);
      return error ? err(error) : ok(null);
    }
    const { error } = await supabase!
      .from("routine_completions")
      .insert({
        routine_id: routineId,
        user_id: userId,
        completed_item_ids: next,
      });
    return error ? err(error) : ok(null);
  },

  /** Delete a routine (cascades to items). */
  async delete(userId: string, routineId: string): ApiResult<null> {
    const g = guard();
    if (g) return g;
    const { error } = await supabase!
      .from("routines")
      .delete()
      .eq("id", routineId)
      .eq("user_id", userId);
    return error ? err(error) : ok(null);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// REFLECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const reflectionsApi = {
  /** List reflections for the past N days. */
  async list(userId: string, daysBack = 7): ApiResult<object[]> {
    const g = guard();
    if (g) return g;
    const d = new Date();
    d.setDate(d.getDate() - daysBack);
    const oldest = d.toISOString().split("T")[0];
    const { data, error } = await supabase!
      .from("reflections")
      .select("*")
      .eq("user_id", userId)
      .gte("entry_date", oldest)
      .order("entry_date", { ascending: false });
    return error ? err(error) : ok(data ?? []);
  },

  /** Upsert today's reflection. content is Tiptap JSON. */
  async save(
    userId: string,
    opts: { content: object; mood?: string; entry_date?: string },
  ): ApiResult<object> {
    const g = guard();
    if (g) return g;
    const entry_date =
      opts.entry_date ?? new Date().toISOString().split("T")[0];
    const { data, error } = await supabase!
      .from("reflections")
      .upsert(
        {
          user_id: userId,
          content: opts.content,
          mood: opts.mood ?? null,
          entry_date,
        },
        { onConflict: "user_id,entry_date" },
      )
      .select()
      .single();
    return error ? err(error) : ok(data);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SKILL TREE (Growth Path)
// ─────────────────────────────────────────────────────────────────────────────

export const skillTreeApi = {
  /** Get all completed node IDs for the user. */
  async list(userId: string): ApiResult<string[]> {
    const g = guard();
    if (g) return g;
    const { data, error } = await supabase!
      .from("skill_tree_completions")
      .select("node_id")
      .eq("user_id", userId);
    return error
      ? err(error)
      : ok((data ?? []).map((r) => r.node_id as string));
  },

  /** Mark a node complete. */
  async complete(userId: string, nodeId: string): ApiResult<null> {
    const g = guard();
    if (g) return g;
    const { error } = await supabase!
      .from("skill_tree_completions")
      .insert({ user_id: userId, node_id: nodeId });
    return error ? err(error) : ok(null);
  },

  /** Unmark a node. */
  async uncomplete(userId: string, nodeId: string): ApiResult<null> {
    const g = guard();
    if (g) return g;
    const { error } = await supabase!
      .from("skill_tree_completions")
      .delete()
      .eq("user_id", userId)
      .eq("node_id", nodeId);
    return error ? err(error) : ok(null);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Unified API object — convenient for AI Coach
// ─────────────────────────────────────────────────────────────────────────────

export const api = {
  intentions: intentionsApi,
  dimensions: dimensionsApi,
  focus: focusApi,
  routines: routinesApi,
  reflections: reflectionsApi,
  skillTree: skillTreeApi,
} as const;
