
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentSearchModal } from "@/components/forms/patient-invoice/DocumentSearchModal";

interface Props {
  onOk?: (from: string, to: string) => void;
  onCancel?: () => void;
}

export default function PatientRequestReportFilter({
  onOk,
  onCancel,
}: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Track which search modal is open: "from", "to", or null
  const [searchModalOpenFor, setSearchModalOpenFor] = useState<"from" | "to" | null>(null);

  const handleOpenSearchModal = (which: "from" | "to") => {
    setSearchModalOpenFor(which);
  };

  const handleDocumentSelect = (docNum: string) => {
    if (searchModalOpenFor === "from") {
      setFrom(docNum);
    } else if (searchModalOpenFor === "to") {
      setTo(docNum);
    }
    setSearchModalOpenFor(null);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) setSearchModalOpenFor(null);
  };

  return (
    <Card className="max-w-xl mx-auto mb-6 border-gray-300 shadow-lg">
      <CardHeader className="flex flex-row gap-2 items-center bg-blue-50 border-b border-gray-200 rounded-t px-4 py-3">
        <img alt="icon" src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide@latest/icons/filter.svg" width={20} height={20} className="text-blue-600" />
        <CardTitle className="text-lg font-semibold text-blue-900">Patient Request Report Filter</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4 bg-white">
        {/* "Filter" section header */}
        <div className="flex items-center gap-2 mb-4">
          <Search size={18} className="text-blue-600" />
          <span className="font-medium text-base text-gray-700">Filter</span>
        </div>

        {/* Table for From/To */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="grid grid-cols-3 bg-blue-100 border-b border-gray-200">
            <div className="p-3 border-r border-gray-200 text-center font-medium text-blue-900">Column</div>
            <div className="p-3 border-r border-gray-200 text-center font-medium text-blue-900">From</div>
            <div className="p-3 text-center font-medium text-blue-900">To</div>
          </div>
          <div className="grid grid-cols-3 bg-white">
            {/* "Code:" row */}
            <div className="p-3 border-r border-gray-200 bg-gray-50 flex items-center justify-center font-medium text-gray-700">Code:</div>
            {/* From */}
            <div className="p-3 border-r border-gray-200">
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="border border-gray-300 bg-white rounded px-2 py-1 w-full text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ height: 32 }}
                />
                <Button
                  size="icon"
                  variant="outline"
                  tabIndex={-1}
                  type="button"
                  className="ml-1 px-0 py-0 w-8 h-8 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600"
                  onClick={() => handleOpenSearchModal("from")}
                  aria-label="Search From Doc No"
                >
                  <span className="font-bold text-lg leading-none">?</span>
                </Button>
              </div>
            </div>
            {/* To */}
            <div className="p-3">
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="border border-gray-300 bg-white rounded px-2 py-1 w-full text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ height: 32 }}
                />
                <Button
                  size="icon"
                  variant="outline"
                  tabIndex={-1}
                  type="button"
                  className="ml-1 px-0 py-0 w-8 h-8 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600"
                  onClick={() => handleOpenSearchModal("to")}
                  aria-label="Search To Doc No"
                >
                  <span className="font-bold text-lg leading-none">?</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer action buttons */}
        <div className="flex flex-row gap-2 justify-end px-2 pt-6">
          <Button
            type="button"
            size="sm"
            variant="default"
            className="min-w-[80px] bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => onOk?.(from, to)}
          >
            OK
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-w-[80px] border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
        {/* Document Search Modal */}
        <DocumentSearchModal
          isOpen={!!searchModalOpenFor}
          onOpenChange={handleModalOpenChange}
          onDocumentSelect={handleDocumentSelect}
        />
      </CardContent>
    </Card>
  );
}
