
-- Add separate columns for screening results to bleeding_records table
ALTER TABLE bleeding_records 
ADD COLUMN hbsag NUMERIC,
ADD COLUMN hcv NUMERIC, 
ADD COLUMN hiv NUMERIC,
ADD COLUMN vdrl NUMERIC,
ADD COLUMN hb NUMERIC;

-- Update existing records to extract screening values from remarks if they exist
-- This is a best-effort migration for existing data
UPDATE bleeding_records 
SET 
  hb = CASE 
    WHEN remarks ~ 'HB: ([0-9.]+)' THEN 
      (regexp_match(remarks, 'HB: ([0-9.]+)'))[1]::NUMERIC
    ELSE NULL 
  END,
  hbsag = CASE 
    WHEN remarks ~ 'HepB: ([0-9.]+)' THEN 
      (regexp_match(remarks, 'HepB: ([0-9.]+)'))[1]::NUMERIC
    ELSE NULL 
  END,
  hcv = CASE 
    WHEN remarks ~ 'HepC: ([0-9.]+)' THEN 
      (regexp_match(remarks, 'HepC: ([0-9.]+)'))[1]::NUMERIC
    ELSE NULL 
  END,
  hiv = CASE 
    WHEN remarks ~ 'HIV: ([0-9.]+)' THEN 
      (regexp_match(remarks, 'HIV: ([0-9.]+)'))[1]::NUMERIC
    ELSE NULL 
  END,
  vdrl = CASE 
    WHEN remarks ~ 'VDRL: ([0-9.]+)' THEN 
      (regexp_match(remarks, 'VDRL: ([0-9.]+)'))[1]::NUMERIC
    ELSE NULL 
  END
WHERE remarks IS NOT NULL;
