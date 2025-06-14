
ALTER TABLE public.test_report_results
ADD CONSTRAINT test_report_document_test_unique UNIQUE (document_no, test_id);
