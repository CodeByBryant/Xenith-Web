-- Recharge Activities
CREATE TABLE recharge_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('meditation', 'walk', 'hobby', 'social', 'reading', 'other')),
  duration_minutes INTEGER,
  feeling_before INTEGER CHECK (feeling_before >= 1 AND feeling_before <= 5),
  feeling_after INTEGER CHECK (feeling_after >= 1 AND feeling_after <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recharge_user ON recharge_activities(user_id);
CREATE INDEX idx_recharge_date ON recharge_activities(activity_date DESC);
CREATE INDEX idx_recharge_type ON recharge_activities(activity_type);

ALTER TABLE recharge_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recharge_activities"
  ON recharge_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recharge_activities"
  ON recharge_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recharge_activities"
  ON recharge_activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recharge_activities"
  ON recharge_activities FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_recharge_activities_updated_at
  BEFORE UPDATE ON recharge_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
