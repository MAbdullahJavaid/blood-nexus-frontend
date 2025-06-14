
-- Add a unique constraint on donor_id in the donors table
ALTER TABLE public.donors
ADD CONSTRAINT donors_donor_id_unique UNIQUE (donor_id);
