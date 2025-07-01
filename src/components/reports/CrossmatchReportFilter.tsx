
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { CrossmatchSearchModal } from "@/components/forms/crossmatch/CrossmatchSearchModal";
import PatientRequestReportActions from "@/components/reports/PatientRequestReportActions";
import StandardizedFilterCard from "@/components/reports/StandardizedFilterCard";
import StandardizedResultsCard from "@/components/reports/StandardizedResultsCard";
import ReportFilterActions from "@/components/reports/ReportFilterActions";

interface Props {
  onOk?: (from: string, to: string) => void;
  onCancel?: () => void;
  onExportPDF?: () => void;
  onExportJPEG?: () => void;
  onExit?: () => void;
  isExportDisabled?: boolean;
}

export default function CrossmatchReportFilter({
  onOk,
  onCancel,
  onExportPDF,
  onExportJPEG,
  onExit,
  isExportDisabled = true,
}: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Track which search modal is open: "from", "to", or null
  const [searchModalOpenFor, setSearchModalOpenFor] = useState<"from" | "to" | null>(null);

  const handleOpenSearchModal = (which: "from" | "to") => {
    setSearchModalOpenFor(which);
  };

  const handleCrossmatchSelect = (crossmatchNo: string) => {
    if (searchModalOpenFor === "from") {
      setFrom(crossmatchNo);
    } else if (searchModalOpenFor === "to") {
      setTo(crossmatchNo);
    }
    setSearchModalOpenFor(null);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) setSearchModalOpenFor(null);
  };

  const handleOk = () => {
    setShowResults(true);
    onOk?.(from, to);
  };

  const handleCancel = () => {
    setFrom("");
    setTo("");
    setShowResults(false);
    onCancel?.();
  };

  const handleExport = () => {
    // Default to PDF export if available
    if (onExportPDF) {
      onExportPDF();
    }
  };

  const handleExit = () => {
    onExit?.();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Crossmatch Report</h1>
      </div>

      {/* Export and Exit Actions */}
      <PatientRequestReportActions
        onExportPDF={onExportPDF || (() => {})}
        onExportJPEG={onExportJPEG || (() => {})}
        onExit={onExit || (() => {})}
        isExportDisabled={isExportDisabled}
      />

      <StandardizedFilterCard>
        {/* Table matching the screenshot layout */}
        <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
          {/* Header row */}
          <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-300">
            <div className="p-4 border-r border-gray-300 text-center font-semibold text-gray-700">Column</div>
            <div className="p-4 border-r border-gray-300 text-center font-semibold text-gray-700">From</div>
            <div className="p-4 text-center font-semibold text-gray-700">To</div>
          </div>
          
          {/* Data row */}
          <div className="grid grid-cols-3 bg-white">
            {/* Code label */}
            <div className="p-4 border-r border-gray-300 bg-gray-50 flex items-center justify-start font-medium text-gray-700">
              Code:
            </div>
            
            {/* From input */}
            <div className="p-4 border-r border-gray-300">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="border border-gray-300 bg-white rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter code"
                />
                <Button
                  size="icon"
                  variant="outline"
                  type="button"
                  className="w-8 h-8 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600 flex-shrink-0"
                  onClick={() => handleOpenSearchModal("from")}
                  aria-label="Search From Crossmatch No"
                >
                  <span className="font-bold text-sm">?</span>
                </Button>
              </div>
            </div>
            
            {/* To input */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="border border-gray-300 bg-white rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter code"
                />
                <Button
                  size="icon"
                  variant="outline"
                  type="button"
                  className="w-8 h-8 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600 flex-shrink-0"
                  onClick={() => handleOpenSearchModal("to")}
                  aria-label="Search To Crossmatch No"
                >
                  <span className="font-bold text-sm">?</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Standardized Action buttons */}
        <ReportFilterActions
          onOk={handleOk}
          onCancel={handleCancel}
          onExport={handleExport}
          onExit={handleExit}
        />

        {/* Crossmatch Search Modal */}
        <CrossmatchSearchModal
          isOpen={!!searchModalOpenFor}
          onOpenChange={handleModalOpenChange}
          onCrossmatchSelect={handleCrossmatchSelect}
        />
      </StandardizedFilterCard>

      <StandardizedResultsCard showResults={showResults} />
    </div>
  );
}
