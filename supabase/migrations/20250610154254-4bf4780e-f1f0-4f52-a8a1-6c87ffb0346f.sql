
-- Create the pre_report table
CREATE TABLE public.pre_report (
  document_no TEXT PRIMARY KEY,
  patient_id TEXT,
  patient_name TEXT NOT NULL,
  type TEXT,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  hospital_name TEXT,
  gender TEXT,
  dob DATE,
  phone TEXT,
  age INTEGER,
  reference TEXT,
  blood_group TEXT,
  rh TEXT,
  blood_category TEXT,
  bottle_required INTEGER,
  tests_type TEXT, -- JSON string to handle multiple tests
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_pre_report_patient_id ON pre_report(patient_id);
CREATE INDEX idx_pre_report_document_no ON pre_report(document_no);

-- Create trigger function to sync patient invoice data to pre_report table
CREATE OR REPLACE FUNCTION sync_to_pre_report()
RETURNS TRIGGER AS $$
DECLARE
  tests_json TEXT;
BEGIN
  -- Collect all test names from invoice_items for this invoice
  SELECT COALESCE(
    json_agg(
      json_build_object(
        'test_id', test_id,
        'test_name', test_name,
        'quantity', quantity
      )
    )::TEXT, 
    '[]'
  )
  INTO tests_json
  FROM invoice_items 
  WHERE invoice_id = NEW.id;

  -- Insert or update the pre_report table
  INSERT INTO public.pre_report (
    document_no,
    patient_id,
    patient_name,
    type,
    registration_date,
    hospital_name,
    gender,
    dob,
    phone,
    age,
    reference,
    blood_group,
    rh,
    blood_category,
    bottle_required,
    tests_type
  ) VALUES (
    NEW.document_no,
    NEW.patient_id,
    NEW.patient_name,
    NEW.patient_type,
    NEW.created_at,
    NEW.hospital_name,
    NEW.gender,
    NEW.dob,
    NEW.phone_no,
    NEW.age,
    NEW.reference_notes,
    NEW.blood_group_separate,
    NEW.rh_factor,
    NEW.blood_category,
    NEW.bottle_quantity,
    tests_json
  )
  ON CONFLICT (document_no) 
  DO UPDATE SET
    patient_id = EXCLUDED.patient_id,
    patient_name = EXCLUDED.patient_name,
    type = EXCLUDED.type,
    registration_date = EXCLUDED.registration_date,
    hospital_name = EXCLUDED.hospital_name,
    gender = EXCLUDED.gender,
    dob = EXCLUDED.dob,
    phone = EXCLUDED.phone,
    age = EXCLUDED.age,
    reference = EXCLUDED.reference,
    blood_group = EXCLUDED.blood_group,
    rh = EXCLUDED.rh,
    blood_category = EXCLUDED.blood_category,
    bottle_required = EXCLUDED.bottle_required,
    tests_type = EXCLUDED.tests_type,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on patient_invoices table
CREATE TRIGGER trigger_sync_to_pre_report
  AFTER INSERT OR UPDATE ON patient_invoices
  FOR EACH ROW
  EXECUTE FUNCTION sync_to_pre_report();

-- Add updated_at trigger for pre_report table
CREATE TRIGGER trigger_pre_report_updated_at
  BEFORE UPDATE ON pre_report
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
