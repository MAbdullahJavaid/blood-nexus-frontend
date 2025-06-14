
-- Table to store individual test results associated with a report/document
CREATE TABLE public.test_report_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_no TEXT NOT NULL REFERENCES pre_report(document_no) ON DELETE CASCADE,
  test_id INTEGER NOT NULL,
  test_name TEXT NOT NULL,
  category TEXT,
  measuring_unit TEXT,
  low_value TEXT,
  high_value TEXT,
  high_flag BOOLEAN DEFAULT FALSE,
  low_flag BOOLEAN DEFAULT FALSE,
  user_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast lookups by document_no and test_id
CREATE INDEX idx_test_report_results_document_no ON public.test_report_results(document_no);
CREATE INDEX idx_test_report_results_test_id ON public.test_report_results(test_id);

-- Enable row-level security
ALTER TABLE public.test_report_results ENABLE ROW LEVEL SECURITY;

-- Policy: allow users to select all (adjust if user scoping is needed)
CREATE POLICY "Allow all select test report results"
  ON public.test_report_results
  FOR SELECT
  USING (true);

-- Policy: allow insert/update/delete (can be restricted later if authentication is added)
CREATE POLICY "Allow all modify test report results"
  ON public.test_report_results
  FOR ALL
  USING (true)
  WITH CHECK (true);
