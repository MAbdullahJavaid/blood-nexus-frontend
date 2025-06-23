
import React from "react";
import PatientRequestSummaryFilter from "@/components/reports/PatientRequestSummaryFilter";

const PatientRequestSummaryReport = () => {
  const handleOk = (invoiceFrom: string, invoiceTo: string, dateFrom: Date, dateTo: Date) => {
    console.log("Filter applied:", { invoiceFrom, invoiceTo, dateFrom, dateTo });
    // TODO: Implement filtering logic
  };

  const handleCancel = () => {
    console.log("Filter cancelled");
  };

  const handleExport = () => {
    console.log("Export requested");
    // TODO: Implement export functionality
  };

  const handleExit = () => {
    console.log("Exit requested");
    // TODO: Implement exit functionality
  };

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
