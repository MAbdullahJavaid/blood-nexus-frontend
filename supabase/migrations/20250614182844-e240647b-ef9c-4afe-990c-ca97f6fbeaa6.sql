
-- Add missing columns to pre_report to support the sync trigger from patient_invoices
ALTER TABLE public.pre_report ADD COLUMN IF NOT EXISTS tests_type TEXT;

ALTER TABLE public.pre_report ADD COLUMN IF NOT EXISTS category TEXT;
