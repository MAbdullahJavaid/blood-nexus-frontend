
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";

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

  // EXPORT PDF using the same approach as other reports
  const handleExportPDF = async () => {
    if (!receiptDataList.length) {
      toast({ title: "Nothing to export", description: "No report data loaded.", variant: "destructive" });
      return;
    }

    try {
      toast({ title: "Exporting", description: "Generating PDF, please wait..." });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      
      for (let i = 0; i < receiptDataList.length; i++) {
        if (i > 0) pdf.addPage();
        
        // Create a temporary container for each report
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '210mm';
        tempContainer.style.background = 'white';
        tempContainer.innerHTML = `
          <div style="padding: 20px;">
            ${document.querySelector(`#patient-receipt-${i}`)?.innerHTML || ''}
          </div>
        `;
        document.body.appendChild(tempContainer);

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
        
        // Clean up
        document.body.removeChild(tempContainer);
      }
      
      pdf.save(`Patient_Request_Report_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
      toast({ title: "PDF Exported", description: "PDF exported successfully!" });
    } catch (err) {
      console.error("PDF Export Error:", err);
      toast({ title: "Export Error", description: "Could not export as PDF.", variant: "destructive" });
    }
  };

  // EXPORT JPEG using the same approach as other reports
  const handleExportJPEG = async () => {
    if (!receiptDataList.length) {
      toast({ title: "Nothing to export", description: "No report data loaded.", variant: "destructive" });
      return;
    }

    try {
      toast({ title: "Exporting", description: "Generating JPEG, please wait..." });
      
      for (let i = 0; i < receiptDataList.length; i++) {
        // Create a temporary container for each report
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '210mm';
        tempContainer.style.background = 'white';
        tempContainer.innerHTML = `
          <div style="padding: 20px;">
            ${document.querySelector(`#patient-receipt-${i}`)?.innerHTML || ''}
          </div>
        `;
        document.body.appendChild(tempContainer);

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        const link = document.createElement('a');
        link.download = `Patient_Request_${receiptDataList[i].document_no}_${format(new Date(), 'dd-MM-yyyy')}.jpeg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
        
        // Clean up
        document.body.removeChild(tempContainer);
      }
      
      toast({ title: "JPEG Exported", description: "JPEG exported successfully!" });
    } catch (err) {
      console.error("JPEG Export Error:", err);
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
                <div id={`patient-receipt-${currentPage}`}>
                  <PatientRequestReceiptDisplay invoice={receiptDataList[currentPage]} />
                </div>
              </div>
              {receiptDataList.length > 1 && (
                <Pagination className="mt-4 mb-2">
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
