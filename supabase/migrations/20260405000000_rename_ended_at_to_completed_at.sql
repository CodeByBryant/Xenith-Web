-- Rename ended_at to completed_at in focus_sessions table if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'focus_sessions' 
        AND column_name = 'ended_at'
    ) THEN
        ALTER TABLE focus_sessions RENAME COLUMN ended_at TO completed_at;
    END IF;
END $$;

-- If the column doesn't exist at all, create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'focus_sessions' 
        AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE focus_sessions ADD COLUMN completed_at timestamptz;
    END IF;
END $$;
