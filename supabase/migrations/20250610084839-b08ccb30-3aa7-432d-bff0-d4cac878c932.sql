
-- Create crossmatch_records table to store crossmatch form data
CREATE TABLE public.crossmatch_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crossmatch_no text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  date date NOT NULL DEFAULT CURRENT_DATE,
  patient_name text NOT NULL,
  age integer,
  sex text,
  blood_group text,
  rh text,
  hospital text,
  blood_category text,
  albumin text NOT NULL DEFAULT 'negative',
  saline text NOT NULL DEFAULT 'negative',
  coomb text NOT NULL DEFAULT 'negative',
  result text NOT NULL DEFAULT 'compatible',
  expiry_date date,
  remarks text DEFAULT 'Donor red cells are compatible with patient Serum/Plasma. Donor ELISA screening is negative and blood is ready for transfusion.',
  pre_crossmatch_doc_no text,
  product_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crossmatch_records ENABLE ROW LEVEL SECURITY;

-- Create policy for crossmatch_records
CREATE POLICY "Allow all operations on crossmatch_records" 
  ON public.crossmatch_records 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_crossmatch_records_updated_at
  BEFORE UPDATE ON public.crossmatch_records
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
