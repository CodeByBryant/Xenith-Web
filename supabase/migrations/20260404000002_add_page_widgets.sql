-- Add widgets column to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS widgets jsonb DEFAULT '[]'::jsonb;
