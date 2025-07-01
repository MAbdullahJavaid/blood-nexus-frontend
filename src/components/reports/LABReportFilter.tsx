
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import StandardizedFilterCard from "@/components/reports/StandardizedFilterCard";
import StandardizedResultsCard from "@/components/reports/StandardizedResultsCard";
import ReportFilterActions from "@/components/reports/ReportFilterActions";

interface LABReportFilterProps {
  title: string;
}

const LABReportFilter = ({ title }: LABReportFilterProps) => {
  const navigate = useNavigate();
  const [codeFrom, setCodeFrom] = useState("");
  const [codeTo, setCodeTo] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleOK = () => {
    console.log("Applying filters:", {
      codeFrom,
      codeTo
    });
    setShowResults(true);
  };

  const handleCancel = () => {
    setCodeFrom("");
    setCodeTo("");
    setShowResults(false);
  };

  const handleExport = () => {
    console.log("Exporting report...");
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <StandardizedFilterCard>
        {/* Filter Table */}
        <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-300">
            <div className="p-4 border-r border-gray-300 text-center font-semibold text-gray-700">Column</div>
            <div className="p-4 border-r border-gray-300 text-center font-semibold text-gray-700">From</div>
            <div className="p-4 text-center font-semibold text-gray-700">To</div>
          </div>

          {/* Code Row */}
          <div className="grid grid-cols-3 bg-white">
            <div className="p-4 border-r border-gray-300 bg-gray-50 flex items-center justify-start font-medium text-gray-700">
              <Label className="font-medium">Code:</Label>
            </div>
            <div className="p-4 border-r border-gray-300">
              <Input
                value={codeFrom}
                onChange={(e) => setCodeFrom(e.target.value)}
                placeholder="From code"
                className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="p-4">
              <Input
                value={codeTo}
                onChange={(e) => setCodeTo(e.target.value)}
                placeholder="To code"
                className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <ReportFilterActions
          onOk={handleOK}
          onCancel={handleCancel}
          onExport={handleExport}
          onExit={handleExit}
        />
      </StandardizedFilterCard>

      <StandardizedResultsCard showResults={showResults} />
    </div>
  );
};

export default LABReportFilter;
