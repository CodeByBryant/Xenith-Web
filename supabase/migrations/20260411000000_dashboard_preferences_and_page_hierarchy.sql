-- Dashboard preferences (custom widget ordering/visibility)
CREATE TABLE IF NOT EXISTS public.dashboard_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_order text[] NOT NULL DEFAULT '{}',
  hidden_widgets text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dashboard_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own dashboard preferences" ON public.dashboard_preferences;
DROP POLICY IF EXISTS "Users can create own dashboard preferences" ON public.dashboard_preferences;
DROP POLICY IF EXISTS "Users can update own dashboard preferences" ON public.dashboard_preferences;
DROP POLICY IF EXISTS "Users can delete own dashboard preferences" ON public.dashboard_preferences;

CREATE POLICY "Users can view own dashboard preferences"
  ON public.dashboard_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own dashboard preferences"
  ON public.dashboard_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dashboard preferences"
  ON public.dashboard_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dashboard preferences"
  ON public.dashboard_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_dashboard_preferences_updated_at ON public.dashboard_preferences;
CREATE TRIGGER set_dashboard_preferences_updated_at
  BEFORE UPDATE ON public.dashboard_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Notion-like page hierarchy and search support
ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS parent_page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_pages_parent_page_id ON public.pages(parent_page_id);

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS search_text tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content::text, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_pages_search_text ON public.pages USING gin(search_text);