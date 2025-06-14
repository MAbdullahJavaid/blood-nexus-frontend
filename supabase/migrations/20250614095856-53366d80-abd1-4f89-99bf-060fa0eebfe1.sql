
-- Add a status column to track donor status (active/inactive)
ALTER TABLE public.donors
ADD COLUMN status boolean DEFAULT true;

-- Add a comment for clarity
COMMENT ON COLUMN public.donors.status IS 'Indicates if the donor is currently active (true) or inactive (false)';
