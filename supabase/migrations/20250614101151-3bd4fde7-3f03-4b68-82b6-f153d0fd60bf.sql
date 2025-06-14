
-- Create a trigger function that sets the donor's status to false when a bleeding record is inserted
CREATE OR REPLACE FUNCTION public.set_donor_inactive_on_bleeding_insert()
RETURNS trigger AS $$
BEGIN
  -- Update the donor's status to false (inactive)
  UPDATE public.donors
  SET status = false
  WHERE id = NEW.donor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it already exists to avoid duplication
DROP TRIGGER IF EXISTS set_donor_inactive_after_bleeding_insert ON public.bleeding_records;

-- Create the trigger on the bleeding_records table for INSERTs
CREATE TRIGGER set_donor_inactive_after_bleeding_insert
AFTER INSERT ON public.bleeding_records
FOR EACH ROW
EXECUTE FUNCTION public.set_donor_inactive_on_bleeding_insert();
