
import React from "react";
import VolunteerReportFilter from "@/components/reports/VolunteerReportFilter";
import { toast } from "@/hooks/use-toast";

const VolunteerReport = () => {
  // Placeholder handlers for the filter actions
  const handleOk = (from: Date, to: Date) => {
    toast({
      title: "Filter applied",
      description: `Showing volunteers from ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`
    });
  };
  const handleCancel = () => {
    toast({ title: "Filter canceled" });
  };
  const handleExport = () => {
    toast({ title: "Export started", description: "This will export your filtered report." });
  };
  const handleExit = () => {
    toast({ title: "Exited filter" });
  };

  return (
    <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-extrabold mb-2 text-center">Blood Care Foundation</h1>
        <h2 className="text-xl italic underline mb-6 text-center text-gray-700">
          Volunteer Report
        </h2>
      </div>
      <div className="w-full max-w-4xl mb-8">
        <VolunteerReportFilter
          onOk={handleOk}
          onCancel={handleCancel}
          onExport={handleExport}
          onExit={handleExit}
        />
      </div>
      {/* Placeholder for table or report results */}
      <div className="bg-white rounded shadow p-8 max-w-xl w-full text-center">
        <p className="text-lg text-gray-600 mb-4">
          (Coming soon) Volunteer table or results will appear here!
        </p>
      </div>
    </div>
  );
};

export default VolunteerReport;

