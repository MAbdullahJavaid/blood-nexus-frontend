
-- Add category column to pre_report table
ALTER TABLE public.pre_report 
ADD COLUMN category TEXT;

-- Update the sync_to_pre_report function to include category information
CREATE OR REPLACE FUNCTION sync_to_pre_report()
RETURNS TRIGGER AS $$
DECLARE
  tests_json TEXT;
  categories_text TEXT;
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

  -- Get categories for the tests in this invoice
  SELECT STRING_AGG(DISTINCT tc.name, ', ')
  INTO categories_text
  FROM invoice_items ii
  JOIN test_information ti ON ii.test_id = ti.id
  JOIN test_categories tc ON ti.category_id = tc.id
  WHERE ii.invoice_id = NEW.id;

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
    tests_type,
    category
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
    tests_json,
    categories_text
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
    category = EXCLUDED.category,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
