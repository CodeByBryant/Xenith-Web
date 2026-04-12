-- Values Check-In table for tracking alignment with core values
CREATE TABLE IF NOT EXISTS values_checkin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  core_values TEXT[] NOT NULL, -- Array of up to 5 core values
  alignment_score INTEGER NOT NULL CHECK (alignment_score >= 1 AND alignment_score <= 5),
  aligned_actions TEXT, -- What actions aligned with values
  misaligned_actions TEXT, -- What actions didn't align
  reflection TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE values_checkin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own check-ins"
  ON values_checkin FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own check-ins"
  ON values_checkin FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins"
  ON values_checkin FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins"
  ON values_checkin FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_values_checkin_user_date ON values_checkin(user_id, checkin_date DESC);

-- Update trigger
CREATE TRIGGER update_values_checkin_updated_at
  BEFORE UPDATE ON values_checkin
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
