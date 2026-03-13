-- ── Skill Tree Completions ──────────────────────────────────────────────────
-- Stores which skill tree nodes each user has marked as complete.
-- node_id is a stable string key defined in the frontend (e.g. "h-f1").
-- No XP or scoring — completion is trust-based (user integrity).

CREATE TABLE IF NOT EXISTS skill_tree_completions (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id       text        NOT NULL,
  completed_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, node_id)
);

ALTER TABLE skill_tree_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own skill tree"
  ON skill_tree_completions
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS skill_tree_completions_user_id_idx
  ON skill_tree_completions (user_id);
