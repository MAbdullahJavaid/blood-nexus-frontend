
-- Create blood_drive_requests table for organizing blood drives
CREATE TABLE public.blood_drive_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  org_name TEXT,
  date_preference DATE,
  location TEXT NOT NULL,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blood_drive_requests ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can insert for public form
CREATE POLICY "Public can insert blood drive requests"
  ON public.blood_drive_requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: anyone can view (for basic review, adjust as needed)
CREATE POLICY "Public can view blood drive requests"
  ON public.blood_drive_requests
  FOR SELECT
  USING (true);
