
import React, { useState } from "react";
import PatientRequestReportFilter from "@/components/reports/PatientRequestReportFilter";
import PatientRequestReceiptDisplay from "@/components/reports/PatientRequestReceiptDisplay";
import { supabase } from "@/integrations/supabase/client";

const PatientRequestReport = () => {
  const [receiptData, setReceiptData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const handleOk = async (from: string, to: string) => {
    if (!from) {
      setNoData(true);
      setReceiptData(null);
      return;
    }
    setLoading(true);
    setNoData(false);
    setReceiptData(null);
    // Only search for the "from" document for now (single)
    const { data, error } = await supabase
      .from("patient_invoices")
      .select(
        "*, invoice_items:invoice_items(test_id,test_name,quantity,unit_price,total_price)"
      )
      .eq("document_no", from)
      .maybeSingle();

    if (!data || error) {
      setNoData(true);
      setReceiptData(null);
      setLoading(false);
      return;
    }
    setReceiptData(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#a9a9a9] flex items-center justify-center p-3">
      <div>
        <PatientRequestReportFilter onOk={handleOk} />
        {/* Show loading / no data / receipt */}
        <div className="mt-6">
          {loading && (
            <div className="text-center text-gray-700 py-10">
              Loading receipt...
            </div>
          )}
          {noData && (
            <div className="text-center text-destructive py-10">
              No data found for this document number.
            </div>
          )}
          {receiptData && <PatientRequestReceiptDisplay invoice={receiptData} />}
        </div>
      </div>
    </div>
  );
};

export default PatientRequestReport;

