
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FileText, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import StandardizedFilterCard from "@/components/reports/StandardizedFilterCard";
import StandardizedResultsCard from "@/components/reports/StandardizedResultsCard";
import ReportFilterActions from "@/components/reports/ReportFilterActions";

interface BloodDriveReportFilterProps {
  onOk?: (from: Date, to: Date) => void;
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

export default function BloodDriveReportFilter({
  onOk,
  onCancel,
  onExport,
  onExit,
}: BloodDriveReportFilterProps) {
  const [datePreset, setDatePreset] = useState("thisFiscalYear");
  const [fromDate, setFromDate] = useState<Date>(fiscalYearStart);
  const [toDate, setToDate] = useState<Date>(fiscalYearEnd);
  const [showResults, setShowResults] = useState(false);

  // Handle preset select
  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
    const range = getPresetRange(preset);
    setFromDate(range.from);
    setToDate(range.to);
  };

  // Button handlers
  const handleOk = () => {
    setShowResults(true);
    if (onOk) onOk(fromDate, toDate);
  };
  const handleCancel = () => {
    setDatePreset("thisFiscalYear");
    setFromDate(fiscalYearStart);
    setToDate(fiscalYearEnd);
    setShowResults(false);
    if (onCancel) onCancel();
  };
  const handleExport = () => {
    if (onExport) onExport();
  };
  const handleExit = () => {
    if (onExit) onExit();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Blood Drive Report</h1>
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
          {/* Dates Row */}
          <div className="grid grid-cols-3 bg-white">
            {/* Column name and Quick Picker */}
            <div className="p-4 border-r border-gray-300 bg-gray-50 flex items-center justify-start font-medium text-gray-700">
              <Label className="font-medium">Dates:</Label>
              <Select value={datePreset} onValueChange={handlePresetChange}>
                <SelectTrigger className="ml-2 w-32">
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
            {/* From date */}
            <div className="p-4 border-r border-gray-300">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border border-gray-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>01/07/2024</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* To date */}
            <div className="p-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border border-gray-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "dd/MM/yyyy") : <span>30/06/2025</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <ReportFilterActions
          onOk={handleOk}
          onCancel={handleCancel}
          onExport={handleExport}
          onExit={handleExit}
        />
      </StandardizedFilterCard>
    </div>
  );
}
