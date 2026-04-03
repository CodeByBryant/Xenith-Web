-- Daily Gratitude
CREATE TABLE gratitude_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  items TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

CREATE INDEX idx_gratitude_user ON gratitude_entries(user_id);
CREATE INDEX idx_gratitude_date ON gratitude_entries(entry_date DESC);

ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gratitude"
  ON gratitude_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gratitude"
  ON gratitude_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gratitude"
  ON gratitude_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gratitude"
  ON gratitude_entries FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_gratitude_updated_at
  BEFORE UPDATE ON gratitude_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
