-- ─── Waitlist table RLS policies ─────────────────────────────────────────────
--
-- The `waitlist` table must have Row-Level Security enabled so that the
-- Supabase anon key used in the browser can only INSERT rows and cannot read,
-- update, or delete any data.
--
-- Run this migration once against your Supabase project, or apply each
-- statement manually in the Supabase SQL editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Enable RLS on the waitlist table (idempotent).
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- 2. Drop any pre-existing policies so this migration is re-runnable.
DROP POLICY IF EXISTS "anon_insert_waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "anon_select_waitlist" ON public.waitlist;

-- 3. Allow the anonymous (public) role to INSERT only.
--    No SELECT / UPDATE / DELETE policy is created, so those operations are
--    denied to the anon role even if RLS were accidentally disabled later.
CREATE POLICY "anon_insert_waitlist"
  ON public.waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ─── Secure count function ────────────────────────────────────────────────────
--
-- The client calls this RPC instead of SELECT * FROM waitlist so that the
-- anon role never needs raw SELECT access on the table.
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS.
-- ─────────────────────────────────────────────────────────────────────────────

-- 4. Create (or replace) a SECURITY DEFINER function that returns the row count.
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
  RETURNS bigint
  LANGUAGE sql
  SECURITY DEFINER
  -- Restrict the search path to prevent search-path injection attacks.
  SET search_path = public
AS $$
  SELECT COUNT(*) FROM public.waitlist;
$$;

-- 5. Grant EXECUTE to the anon role so the client can call it.
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon;

-- 6. Revoke direct SELECT on the waitlist table from the anon role
--    (belt-and-suspenders: RLS already denies it, but explicit revoke is safer).
REVOKE SELECT ON public.waitlist FROM anon;
