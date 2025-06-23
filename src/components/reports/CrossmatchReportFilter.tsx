
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrossmatchSearchModal } from "@/components/forms/crossmatch/CrossmatchSearchModal";
import PatientRequestReportActions from "@/components/reports/PatientRequestReportActions";
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

  const handleExport = () => {
    // Default to PDF export if available
    if (onExportPDF) {
      onExportPDF();
    }
  };

  return (
    <div>
      {/* Export and Exit Actions */}
      <PatientRequestReportActions
        onExportPDF={onExportPDF || (() => {})}
        onExportJPEG={onExportJPEG || (() => {})}
        onExit={onExit || (() => {})}
        isExportDisabled={isExportDisabled}
      />

      <Card className="max-w-4xl mx-auto mb-6 border-gray-300 shadow-sm">
        {/* Yellow header matching the screenshot */}
        <CardHeader className="bg-yellow-200 border-b border-gray-300 rounded-t-lg px-6 py-4">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
              <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 8h10M7 12h7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Report Filter
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 pb-6 bg-white">
          {/* Filter section header */}
          <div className="flex items-center gap-2 mb-6">
            <Search size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-800">Filter</span>
          </div>

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
            onOk={() => onOk?.(from, to)}
            onCancel={onCancel || (() => {})}
            onExport={handleExport}
            onExit={onExit || (() => {})}
          />

          {/* Crossmatch Search Modal */}
          <CrossmatchSearchModal
            isOpen={!!searchModalOpenFor}
            onOpenChange={handleModalOpenChange}
            onCrossmatchSelect={handleCrossmatchSelect}
          />
        </CardContent>
      </Card>
    </div>
  );
}
