
import { useState } from "react";
import CrossmatchReportFilter from "@/components/reports/CrossmatchReportFilter";

const CrossmatchReport = () => {
  const [showFilter, setShowFilter] = useState(true);

  const handleOk = (from: string, to: string) => {
    console.log("Filter applied:", { from, to });
    // TODO: Apply filter logic here
    setShowFilter(false);
  };

  const handleCancel = () => {
    setShowFilter(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showFilter ? (
        <CrossmatchReportFilter onOk={handleOk} onCancel={handleCancel} />
      ) : (
        <div className="text-center text-gray-600 text-lg">
          Crossmatch Report will be displayed here after applying filters.
        </div>
      )}
    </div>
  );
};

export default CrossmatchReport;
