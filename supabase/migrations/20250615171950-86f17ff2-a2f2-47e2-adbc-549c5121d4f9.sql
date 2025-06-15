
-- Add 'admin' to the app_role enum if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'app_role' AND e.enumlabel = 'admin'
  ) THEN
    ALTER TYPE app_role ADD VALUE 'admin';
  END IF;
END
$$;
