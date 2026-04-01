-- ═══════════════════════════════════════════════════════════════════════
-- Intentions: Time Picker & Notifications
-- ═══════════════════════════════════════════════════════════════════════

-- Add reminder fields to intentions table
alter table public.intentions
add column if not exists reminder_time time,
add column if not exists reminder_enabled boolean default false;

-- Add index for querying enabled reminders
create index if not exists intentions_reminder_enabled 
  on public.intentions(user_id, reminder_enabled, scheduled_date)
  where reminder_enabled = true;
