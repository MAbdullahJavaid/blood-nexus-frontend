
-- Create the pre_crossmatch table
CREATE TABLE public.pre_crossmatch (
  document_no text PRIMARY KEY,
  patient_name text NOT NULL,
  age integer,
  sex text,
  blood_group text,
  rh text,
  hospital text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.pre_crossmatch ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on pre_crossmatch" 
  ON public.pre_crossmatch 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create a function to insert data into pre_crossmatch when patient_invoices is inserted/updated
CREATE OR REPLACE FUNCTION public.sync_to_pre_crossmatch()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert or update the pre_crossmatch table
  INSERT INTO public.pre_crossmatch (
    document_no,
    patient_name,
    age,
    sex,
    blood_group,
    rh,
    hospital
  ) VALUES (
    NEW.document_no,
    NEW.patient_name,
    NEW.age,
    NEW.gender,
    NEW.blood_group_separate,
    NEW.rh_factor,
    NEW.hospital_name
  )
  ON CONFLICT (document_no) 
  DO UPDATE SET
    patient_name = EXCLUDED.patient_name,
    age = EXCLUDED.age,
    sex = EXCLUDED.sex,
    blood_group = EXCLUDED.blood_group,
    rh = EXCLUDED.rh,
    hospital = EXCLUDED.hospital,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Create trigger to automatically sync data to pre_crossmatch
CREATE TRIGGER trigger_sync_to_pre_crossmatch
  AFTER INSERT OR UPDATE ON public.patient_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_to_pre_crossmatch();
