
import React, { useState, useRef } from "react";
import PatientRequestReportFilter from "@/components/reports/PatientRequestReportFilter";
import PatientRequestReceiptDisplay from "@/components/reports/PatientRequestReceiptDisplay";
import PatientRequestReportActions from "@/components/reports/PatientRequestReportActions";
import { supabase } from "@/integrations/supabase/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PatientRequestReport = () => {
  const [receiptDataList, setReceiptDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const reportContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleOk = async (from: string, to: string) => {
    setNoData(false);
    setReceiptDataList([]);
    setCurrentPage(0);

    if (!from) {
      setNoData(true);
      return;
    }

    let fromNum = from;
    let toNum = to || from;

    if (fromNum > toNum) {
      setNoData(true);
      return;
    }

    setLoading(true);

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

  // Pagination
  const totalPages = receiptDataList.length;

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  // EXPORT PDF using jsPDF
  const handleExportPDF = async () => {
    if (!receiptDataList.length) {
      toast({ title: "Nothing to export", description: "No report data loaded.", variant: "destructive" });
      return;
    }
    
    const reportNode = reportContainerRef.current;
    if (!reportNode) return;

    try {
      toast({ title: "Exporting", description: "Generating PDF, please wait..." });
      
      // Hide pagination during export
      const paginationElements = document.querySelectorAll('.pagination-hide-export');
      paginationElements.forEach(el => (el as HTMLElement).style.display = 'none');
      
      const canvas = await html2canvas(reportNode, { 
        useCORS: true, 
        backgroundColor: "#fff", 
        scale: 2,
        logging: false
      });
      
      // Restore pagination
      paginationElements.forEach(el => (el as HTMLElement).style.display = '');
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('PatientRequestReport.pdf');
      
      toast({ title: "PDF Saved", description: "PDF exported successfully!" });
    } catch (err) {
      console.error('PDF Export Error:', err);
      toast({ title: "Export Error", description: "Could not export as PDF.", variant: "destructive" });
    }
  };

  // EXPORT JPEG
  const handleExportJPEG = async () => {
    if (!receiptDataList.length) {
      toast({ title: "Nothing to export", description: "No report data loaded.", variant: "destructive" });
      return;
    }
    const reportNode = reportContainerRef.current;
    if (!reportNode) return;
    try {
      toast({ title: "Exporting", description: "Generating JPEG, please wait..." });
      const canvas = await html2canvas(reportNode, { useCORS: true, backgroundColor: "#fff", scale: 2 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg", 0.94);
      link.download = "PatientRequestReport.jpg";
      link.click();
      toast({ title: "JPEG Saved", description: "JPEG exported successfully!" });
    } catch (err) {
      toast({ title: "Export Error", description: "Could not export as JPEG.", variant: "destructive" });
    }
  };

  // EXIT
  const handleExit = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-[#a9a9a9] flex items-center justify-center p-3">
      <div>
        <PatientRequestReportFilter onOk={handleOk} />
        <PatientRequestReportActions
          onExportPDF={handleExportPDF}
          onExportJPEG={handleExportJPEG}
          onExit={handleExit}
          isExportDisabled={loading || !receiptDataList.length}
        />
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
              <div ref={reportContainerRef}>
                <PatientRequestReceiptDisplay invoice={receiptDataList[currentPage]} />
              </div>
              {receiptDataList.length > 1 && (
                <Pagination className="mt-4 mb-2 pagination-hide-export">
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
