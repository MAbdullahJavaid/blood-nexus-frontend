
-- Add donor_category and bag_type columns to bleeding_records table
ALTER TABLE public.bleeding_records 
ADD COLUMN donor_category TEXT,
ADD COLUMN bag_type TEXT DEFAULT 'double';

-- Add a comment to document the new columns
COMMENT ON COLUMN public.bleeding_records.donor_category IS 'Category of the donor (e.g., voluntary, replacement, etc.)';
COMMENT ON COLUMN public.bleeding_records.bag_type IS 'Type of bag used for bleeding (e.g., single, double, triple)';
