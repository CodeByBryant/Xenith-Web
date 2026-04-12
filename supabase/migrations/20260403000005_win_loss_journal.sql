-- Win/Loss Journal
CREATE TABLE win_loss_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('win', 'loss')),
  title TEXT NOT NULL,
  description TEXT,
  lesson_learned TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_win_loss_user ON win_loss_entries(user_id);
CREATE INDEX idx_win_loss_date ON win_loss_entries(entry_date DESC);
CREATE INDEX idx_win_loss_type ON win_loss_entries(entry_type);

ALTER TABLE win_loss_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own win_loss_entries"
  ON win_loss_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own win_loss_entries"
  ON win_loss_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own win_loss_entries"
  ON win_loss_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own win_loss_entries"
  ON win_loss_entries FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_win_loss_entries_updated_at
  BEFORE UPDATE ON win_loss_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
