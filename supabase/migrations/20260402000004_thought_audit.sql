-- Thought Audit Table
-- Log intrusive/negative thoughts, tag by type, surface patterns over time

CREATE TYPE thought_type AS ENUM ('anxiety', 'distraction', 'ego', 'negative', 'worry', 'other');

CREATE TABLE thought_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thought TEXT NOT NULL,
  type thought_type NOT NULL,
  trigger TEXT,
  response TEXT,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_thought_logs_user ON thought_logs(user_id);
CREATE INDEX idx_thought_logs_type ON thought_logs(type);
CREATE INDEX idx_thought_logs_date ON thought_logs(logged_at DESC);

-- RLS
ALTER TABLE thought_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own thought logs"
  ON thought_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own thought logs"
  ON thought_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own thought logs"
  ON thought_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own thought logs"
  ON thought_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_thought_logs_updated_at
  BEFORE UPDATE ON thought_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
