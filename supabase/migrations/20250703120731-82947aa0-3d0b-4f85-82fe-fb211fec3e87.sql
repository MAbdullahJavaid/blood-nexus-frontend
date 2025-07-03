
-- Create table for storing test report results
CREATE TABLE IF NOT EXISTS public.test_report_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_no TEXT NOT NULL,
  test_id INTEGER NOT NULL,
  test_name TEXT NOT NULL,
  category TEXT,
  measuring_unit TEXT,
  low_value TEXT,
  high_value TEXT,
  user_value TEXT,
  low_flag BOOLEAN DEFAULT false,
  high_flag BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(document_no, test_id)
);

-- Enable RLS
ALTER TABLE public.test_report_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all select test report results" ON public.test_report_results
  FOR SELECT USING (true);

CREATE POLICY "Allow all modify test report results" ON public.test_report_results
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_report_results_document_no ON public.test_report_results(document_no);
CREATE INDEX IF NOT EXISTS idx_test_report_results_category ON public.test_report_results(category);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_test_report_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_test_report_results_updated_at
  BEFORE UPDATE ON public.test_report_results
  FOR EACH ROW EXECUTE FUNCTION update_test_report_results_updated_at();
