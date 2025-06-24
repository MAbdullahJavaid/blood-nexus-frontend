
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientRequestSummaryFilter from "@/components/reports/PatientRequestSummaryFilter";
import PatientRequestSummaryDisplay from "@/components/reports/PatientRequestSummaryDisplay";
import { usePatientRequestSummaryData } from "@/hooks/usePatientRequestSummaryData";
import { usePatientRequestSummaryExport } from "@/hooks/usePatientRequestSummaryExport";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PatientRequestSummaryReport = () => {
  const navigate = useNavigate();
  const [filterParams, setFilterParams] = useState<{
    invoiceFrom: string;
    invoiceTo: string;
    dateFrom: Date;
    dateTo: Date;
  } | null>(null);

  const [showReport, setShowReport] = useState(false);

  const { data, allData, loading, currentPage, totalPages, nextPage, previousPage, fetchData } = 
    usePatientRequestSummaryData({
      invoiceFrom: filterParams?.invoiceFrom || "",
      invoiceTo: filterParams?.invoiceTo || "",
      dateFrom: filterParams?.dateFrom || new Date(),
      dateTo: filterParams?.dateTo || new Date(),
    });

  const { exportToPDF, exportToJPG } = usePatientRequestSummaryExport();

  const handleOk = async (invoiceFrom: string, invoiceTo: string, dateFrom: Date, dateTo: Date) => {
    console.log("Filter applied:", { invoiceFrom, invoiceTo, dateFrom, dateTo });
    setFilterParams({ invoiceFrom, invoiceTo, dateFrom, dateTo });
    setShowReport(true);
    
    // Trigger data fetch
    setTimeout(() => {
      fetchData();
    }, 100);
  };

  const handleCancel = () => {
    console.log("Filter cancelled");
    setShowReport(false);
    setFilterParams(null);
  };

  const handleExport = () => {
    if (!showReport || data.length === 0) {
      return;
    }

    const exportChoice = window.confirm("Choose export format:\nOK for PDF, Cancel for JPG");
    
    if (exportChoice) {
      exportToPDF(allData, "patient-request-summary-report");
    } else {
      exportToJPG("patient-request-summary-report");
    }
  };

  const handleExit = () => {
    console.log("Exit requested");
    navigate("/dashboard");
  };

  if (showReport && filterParams) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Report Display */}
        <div id="patient-request-summary-report">
          <PatientRequestSummaryDisplay
            data={data}
            dateFrom={filterParams.dateFrom}
            dateTo={filterParams.dateTo}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>

        {/* Pagination and Controls */}
        <div className="bg-white p-4 border-t flex justify-between items-center print:hidden">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={previousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({allData.length} total records)
            </span>
            
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowReport(false)}
              variant="outline"
              className="px-4"
            >
              Back to Filter
            </Button>
            <Button
              onClick={handleExport}
              className="px-4 bg-green-600 hover:bg-green-700 text-white"
              disabled={loading || data.length === 0}
            >
              Export
            </Button>
            <Button
              onClick={handleExit}
              variant="outline"
              className="px-4"
            >
              Exit
            </Button>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center print:hidden">
            <div className="bg-white p-6 rounded-lg">
              <div className="text-center">Loading report data...</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PatientRequestSummaryFilter
        onOk={handleOk}
        onCancel={handleCancel}
        onExport={handleExport}
        onExit={handleExit}
      />
    </div>
  );
};

export default PatientRequestSummaryReport;
