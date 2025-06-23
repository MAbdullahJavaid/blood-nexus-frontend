
import React, { useState } from "react";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentSearchModal } from "@/components/forms/patient-invoice/DocumentSearchModal";
import ReportFilterActions from "@/components/reports/ReportFilterActions";

interface Props {
  onOk?: (invoiceFrom: string, invoiceTo: string, dateFrom: Date, dateTo: Date) => void;
  onCancel?: () => void;
  onExport?: () => void;
  onExit?: () => void;
}

const fiscalYearStart = new Date(2024, 6, 1); // 1 July 2024
const fiscalYearEnd = new Date(2025, 5, 30);  // 30 June 2025

const datePresets = [
  { label: "This Fiscal Year", value: "thisFiscalYear" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
];

function getPresetRange(value: string) {
  const today = new Date();
  switch (value) {
    case "today":
      return { from: today, to: today };
    case "yesterday":
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      return { from: yest, to: yest };
    case "thisWeek":
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return { from: startOfWeek, to: today };
    case "thisMonth":
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { from: startOfMonth, to: endOfMonth };
    case "thisFiscalYear":
    default:
      return { from: fiscalYearStart, to: fiscalYearEnd };
  }
}

export default function PatientRequestSummaryFilter({
  onOk,
  onCancel,
  onExport,
  onExit,
}: Props) {
  const [invoiceFrom, setInvoiceFrom] = useState("");
  const [invoiceTo, setInvoiceTo] = useState("");
  const [datePreset, setDatePreset] = useState("today");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());

  // Track which search modal is open: "from", "to", or null
  const [searchModalOpenFor, setSearchModalOpenFor] = useState<"from" | "to" | null>(null);

  // Handle preset select
  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
    const range = getPresetRange(preset);
    setFromDate(range.from);
    setToDate(range.to);
  };

  const handleOpenSearchModal = (which: "from" | "to") => {
    setSearchModalOpenFor(which);
  };

  const handleDocumentSelect = (docNum: string) => {
    if (searchModalOpenFor === "from") {
      setInvoiceFrom(docNum);
    } else if (searchModalOpenFor === "to") {
      setInvoiceTo(docNum);
    }
    setSearchModalOpenFor(null);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) setSearchModalOpenFor(null);
  };

  const handleOk = () => {
    if (onOk) onOk(invoiceFrom, invoiceTo, fromDate, toDate);
  };

  const handleCancel = () => {
    setInvoiceFrom("");
    setInvoiceTo("");
    setDatePreset("today");
    const todayRange = getPresetRange("today");
    setFromDate(todayRange.from);
    setToDate(todayRange.to);
    if (onCancel) onCancel();
  };

  const handleExport = () => {
    if (onExport) onExport();
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  return (
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
          
          {/* Invoice No row */}
          <div className="grid grid-cols-3 bg-white border-b border-gray-300">
            <div className="p-4 border-r border-gray-300 bg-gray-50 flex items-center justify-start font-medium text-gray-700">
              Invoice No:
            </div>
            <div className="p-4 border-r border-gray-300">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={invoiceFrom}
                  onChange={e => setInvoiceFrom(e.target.value)}
                  className="border border-gray-300 bg-white rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter invoice no"
                />
                <Button
                  size="icon"
                  variant="outline"
                  type="button"
                  className="w-8 h-8 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600 flex-shrink-0"
                  onClick={() => handleOpenSearchModal("from")}
                  aria-label="Search From Invoice No"
                >
                  <span className="font-bold text-sm">?</span>
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={invoiceTo}
                  onChange={e => setInvoiceTo(e.target.value)}
                  className="border border-gray-300 bg-white rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter invoice no"
                />
                <Button
                  size="icon"
                  variant="outline"
                  type="button"
                  className="w-8 h-8 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600 flex-shrink-0"
                  onClick={() => handleOpenSearchModal("to")}
                  aria-label="Search To Invoice No"
                >
                  <span className="font-bold text-sm">?</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Dates row */}
          <div className="grid grid-cols-3 bg-white">
            <div className="p-4 border-r border-gray-300 bg-gray-50 flex items-center gap-2">
              <span className="font-medium text-gray-700">Dates:</span>
              <Select value={datePreset} onValueChange={handlePresetChange}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue>
                    {datePresets.find(p => p.value === datePreset)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {datePresets.map(preset => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 border-r border-gray-300">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-8 text-xs",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => date && setFromDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-8 text-xs",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {toDate ? format(toDate, "dd/MM/yyyy") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => date && setToDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
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
