import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VolunteerReportFilter from "@/components/reports/VolunteerReportFilter";
import VolunteerReportTable from "@/components/reports/VolunteerReportTable";
import { useVolunteerReportData } from "@/hooks/useVolunteerReportData";
import { toast } from "@/hooks/use-toast";

const getDefaultFilter = () => {
  const now = new Date();
  const from = new Date(now.getFullYear(), 0, 1); // Start of year
  const to = now;
  return { from, to };
};

const VolunteerReport = () => {
  const navigate = useNavigate();
  
  // State for selected filter date range
  const [filter, setFilter] = useState(getDefaultFilter());
  const { data = [], isLoading, isError, error, refetch } = useVolunteerReportData(filter);

  // Handlers for filter
  const handleOk = (from: Date, to: Date) => {
    setFilter({ from, to });
    toast({
      title: "Filter applied",
      description: `Showing volunteers from ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`,
    });
  };
  const handleCancel = () => {
    setFilter(getDefaultFilter());
    toast({ title: "Filter canceled" });
  };
  const handleExport = () => {
    toast({
      title: "Export started",
      description: "This will export your filtered report. (Feature coming soon)",
    });
  };
  const handleExit = () => {
    navigate('/dashboard');
  };

  return (
    <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mb-8">
        <VolunteerReportFilter
          onOk={handleOk}
          onCancel={handleCancel}
          onExport={handleExport}
          onExit={handleExit}
        />
      </div>
      <div className="bg-white rounded shadow p-6 max-w-5xl w-full">
        <VolunteerReportTable
          data={data}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  );
};

export default VolunteerReport;
