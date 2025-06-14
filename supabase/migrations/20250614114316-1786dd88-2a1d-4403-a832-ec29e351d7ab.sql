
-- 1. Update the sync_to_pre_report function to include all necessary test data from both invoice_items and test_information.
CREATE OR REPLACE FUNCTION sync_to_pre_report()
RETURNS TRIGGER AS $$
DECLARE
  tests_json TEXT;
  categories_text TEXT;
  types_text TEXT;
BEGIN
  -- Join invoice_items and test_information to get test metadata (measuring_unit, low, high, etc)
  SELECT COALESCE(
    json_agg(
      json_build_object(
        'test_id', ii.test_id,
        'test_name', ii.test_name,
        'quantity', ii.quantity,
        'type', ii.type,
        'category', ii.category,
        'measuring_unit', ti.description::jsonb->>'measuring_unit',
        'low_value', ti.description::jsonb->>'low_value',
        'high_value', ti.description::jsonb->>'high_value'
      )
    )::TEXT, 
    '[]'
  )
  INTO tests_json
  FROM invoice_items ii
  LEFT JOIN test_information ti ON ii.test_id = ti.id
  WHERE ii.invoice_id = NEW.id;

  -- Get distinct categories from invoice_items for this invoice
  SELECT STRING_AGG(DISTINCT ii.category, ', ')
  INTO categories_text
  FROM invoice_items ii
  WHERE ii.invoice_id = NEW.id AND ii.category IS NOT NULL;

  -- Get distinct types
  SELECT STRING_AGG(DISTINCT ii.type, ', ')
  INTO types_text
  FROM invoice_items ii
  WHERE ii.invoice_id = NEW.id AND ii.type IS NOT NULL;

  -- Insert or update pre_report
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
    types_text,
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

-- 2. Backfill existing pre_report rows with correct tests_type JSON
DO $$
DECLARE
  r RECORD;
  invoice_rec RECORD;
  tests_json TEXT;
BEGIN
  FOR r IN SELECT * FROM pre_report LOOP
    -- Find corresponding patient_invoices row (by document_no)
    SELECT * INTO invoice_rec FROM patient_invoices WHERE document_no = r.document_no LIMIT 1;
    IF invoice_rec.id IS NOT NULL THEN
      -- Build enriched JSON with test details
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'test_id', ii.test_id,
            'test_name', ii.test_name,
            'quantity', ii.quantity,
            'type', ii.type,
            'category', ii.category,
            'measuring_unit', ti.description::jsonb->>'measuring_unit',
            'low_value', ti.description::jsonb->>'low_value',
            'high_value', ti.description::jsonb->>'high_value'
          )
        )::TEXT, 
        '[]'
      )
      INTO tests_json
      FROM invoice_items ii
      LEFT JOIN test_information ti ON ii.test_id = ti.id
      WHERE ii.invoice_id = invoice_rec.id;

      UPDATE pre_report
      SET tests_type = tests_json
      WHERE document_no = r.document_no;
    END IF;
  END LOOP;
END $$;

