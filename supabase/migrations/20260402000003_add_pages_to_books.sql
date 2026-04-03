-- Add page tracking fields to books table
ALTER TABLE books ADD COLUMN total_pages INTEGER;
ALTER TABLE books ADD COLUMN current_page INTEGER DEFAULT 0;

-- Update existing books to calculate current_page from progress_percent if they have total_pages
-- (This is just for migration - new records will handle this automatically)
