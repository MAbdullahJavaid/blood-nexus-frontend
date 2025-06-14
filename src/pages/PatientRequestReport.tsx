import React, { useState } from "react";
import PatientRequestReportFilter from "@/components/reports/PatientRequestReportFilter";
import PatientRequestReceiptDisplay from "@/components/reports/PatientRequestReceiptDisplay";
import { supabase } from "@/integrations/supabase/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const PatientRequestReport = () => {
  const [receiptDataList, setReceiptDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const handleOk = async (from: string, to: string) => {
    setNoData(false);
    setReceiptDataList([]);
    setCurrentPage(0);

    if (!from) {
      setNoData(true);
      return;
    }

    // If "to" is missing, treat as single doc number search.
    let fromNum = from;
    let toNum = to || from;

    // Ensure fromNum <= toNum
    if (fromNum > toNum) {
      setNoData(true);
      return;
    }

    setLoading(true);

    // Fetch all patient_invoices whose document_no is in [fromNum, toNum] (inclusive)
    const { data, error } = await supabase
      .from("patient_invoices")
      .select(
        "*, invoice_items:invoice_items(test_id,test_name,quantity,unit_price,total_price)"
      )
      .gte("document_no", fromNum)
      .lte("document_no", toNum)
      .order("document_no", { ascending: true });

    if (!data || error || data.length === 0) {
      setNoData(true);
      setLoading(false);
      return;
    }
    setReceiptDataList(data);
    setLoading(false);
  };

  // Pagination: one report per "page"
  const totalPages = receiptDataList.length;

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  return (
    <div className="min-h-screen bg-[#a9a9a9] flex items-center justify-center p-3">
      <div>
        <PatientRequestReportFilter onOk={handleOk} />
        <div className="mt-6">
          {loading && (
            <div className="text-center text-gray-700 py-10">
              Loading receipts...
            </div>
          )}
          {noData && (
            <div className="text-center text-destructive py-10">
              No data found for the given document number range.
            </div>
          )}
          {/* Display paginated reports */}
          {receiptDataList.length > 0 && !loading && (
            <>
              <PatientRequestReceiptDisplay invoice={receiptDataList[currentPage]} />
              {/* Pagination controls */}
              {receiptDataList.length > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        tabIndex={0}
                        onClick={handlePrev}
                        aria-disabled={currentPage === 0}
                        className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-4 py-2 border rounded bg-gray-100 text-gray-800">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        tabIndex={0}
                        onClick={handleNext}
                        aria-disabled={currentPage === totalPages - 1}
                        className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRequestReport;
