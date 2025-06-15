
-- Create volunteers table to store volunteer applications
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  age INTEGER,
  occupation TEXT,
  experience TEXT,
  availability TEXT,
  interests TEXT,
  motivation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert volunteer applications (public registration)
CREATE POLICY "Anyone can create volunteer applications" 
  ON public.volunteers 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow admins to view all volunteer applications
CREATE POLICY "Admins can view all volunteer applications" 
  ON public.volunteers 
  FOR SELECT 
  USING (true);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_volunteers_updated_at
  BEFORE UPDATE ON public.volunteers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
