-- Energy-Task Matcher
CREATE TABLE energy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  time_of_day TIME NOT NULL,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 5),
  task_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_energy_logs_user ON energy_logs(user_id);
CREATE INDEX idx_energy_logs_date ON energy_logs(log_date DESC);
CREATE INDEX idx_energy_logs_energy ON energy_logs(energy_level);

ALTER TABLE energy_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own energy_logs"
  ON energy_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own energy_logs"
  ON energy_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own energy_logs"
  ON energy_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own energy_logs"
  ON energy_logs FOR DELETE
  USING (auth.uid() = user_id);
