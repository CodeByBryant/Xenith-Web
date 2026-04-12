-- Decision Journal table for tracking major decisions and outcomes
CREATE TABLE IF NOT EXISTS decision_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision_date DATE NOT NULL DEFAULT CURRENT_DATE,
  decision_title TEXT NOT NULL,
  decision_description TEXT,
  options_considered TEXT[], -- Array of options
  chosen_option TEXT NOT NULL,
  reasoning TEXT,
  expected_outcome TEXT,
  actual_outcome TEXT,
  outcome_date DATE,
  lessons_learned TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE decision_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own decisions"
  ON decision_journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decisions"
  ON decision_journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decisions"
  ON decision_journal FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decisions"
  ON decision_journal FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_decision_journal_user_date ON decision_journal(user_id, decision_date DESC);

-- Update trigger
CREATE TRIGGER update_decision_journal_updated_at
  BEFORE UPDATE ON decision_journal
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
