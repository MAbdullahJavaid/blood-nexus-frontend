
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
    <Card className="max-w-xl mx-auto mb-6">
      <CardHeader className="flex flex-row gap-2 items-center bg-gray-100 border-b rounded-t px-4 py-3">
        <img alt="icon" src="https://cdn.jsdelivr.net/gh/lucide-icons/lucide@latest/icons/filter.svg" width={20} height={20} />
        <CardTitle className="text-lg font-semibold">Patient Request Report Filter</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-0">
        {/* "Filter" section header */}
        <div className="flex items-center gap-2 mb-4">
          <Search size={18} className="text-green-600" />
          <span className="font-medium text-base">Filter</span>
        </div>

        {/* Table for From/To */}
        <div className="border border-gray-300 rounded">
          <div className="grid grid-cols-3 bg-gray-200 border-b">
            <div className="p-3 border-r text-center font-medium">Column</div>
            <div className="p-3 border-r text-center font-medium">From</div>
            <div className="p-3 text-center font-medium">To</div>
          </div>
          <div className="grid grid-cols-3">
            {/* "Code:" row */}
            <div className="p-3 border-r bg-gray-50 flex items-center justify-center font-medium">Code:</div>
            {/* From */}
            <div className="p-3 border-r">
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="border border-gray-400 bg-white rounded px-2 py-1 w-full text-[15px] focus:outline-none focus:ring-1 focus:ring-blue-300"
                  style={{ height: 32 }}
                />
                <Button
                  size="icon"
                  variant="outline"
                  tabIndex={-1}
                  type="button"
                  className="ml-1 px-0 py-0 w-8 h-8 rounded border border-gray-400 bg-[#e8e8e8] hover:bg-gray-200"
                  onClick={() => handleOpenSearchModal("from")}
                  aria-label="Search From Doc No"
                >
                  <span className="font-bold text-gray-600 text-lg leading-none">?</span>
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
                  className="border border-gray-400 bg-white rounded px-2 py-1 w-full text-[15px] focus:outline-none focus:ring-1 focus:ring-blue-300"
                  style={{ height: 32 }}
                />
                <Button
                  size="icon"
                  variant="outline"
                  tabIndex={-1}
                  type="button"
                  className="ml-1 px-0 py-0 w-8 h-8 rounded border border-gray-400 bg-[#e8e8e8] hover:bg-gray-200"
                  onClick={() => handleOpenSearchModal("to")}
                  aria-label="Search To Doc No"
                >
                  <span className="font-bold text-gray-600 text-lg leading-none">?</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer action buttons */}
        <div className="flex flex-row gap-3 justify-end px-2 pt-6 pb-3">
          <Button
            type="button"
            size="sm"
            className="min-w-[80px] border border-gray-300 bg-[#f4f4f4] text-gray-900 shadow-sm hover:bg-gray-200"
            onClick={() => onOk?.(from, to)}
          >
            OK
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-w-[80px]"
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
