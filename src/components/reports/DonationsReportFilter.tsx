
import React, { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, startOfToday, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, set, addYears } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import StandardizedFilterCard from "@/components/reports/StandardizedFilterCard";
import StandardizedResultsCard from "@/components/reports/StandardizedResultsCard";
import ReportFilterActions from "@/components/reports/ReportFilterActions";

// UI date options
const DATE_OPTIONS = [
  { value: "fiscal", label: "This Fiscal Year" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

type DateOption = typeof DATE_OPTIONS[number]["value"];

function getDateRange(option: DateOption): { from: Date; to: Date } {
  const today = startOfToday();

  switch (option) {
    case "today":
      return { from: today, to: today };
    case "yesterday":
      const yest = subDays(today, 1);
      return { from: yest, to: yest };
    case "week":
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      };
    case "month":
      return {
        from: startOfMonth(today),
        to: endOfMonth(today),
      };
    case "fiscal":
    default:
      // Fiscal year: 1 July YYYY to 30 June YYYY+1
      const fyStart =
        today.getMonth() < 6
          ? set(today, { year: today.getFullYear() - 1, month: 6, date: 1 })
          : set(today, { year: today.getFullYear(), month: 6, date: 1 });
      const fyEnd = addYears(fyStart, 1);
      const end = subDays(set(fyEnd, { month: 6, date: 1 }), 1); // 30 Jun next year
      return { from: fyStart, to: end };
  }
}

// Format to dd/MM/yyyy for display
function formatDMY(date: Date) {
  return format(date, "dd/MM/yyyy");
}

export default function DonationsReportFilter({
  onOk,
  onCancel,
  onExport,
  onExit
}: {
  onOk?: (from: Date, to: Date) => void;
  onCancel?: () => void;
  onExport?: (from: Date, to: Date) => void;
  onExit?: () => void;
}) {
  const [dateOption, setDateOption] = useState<DateOption>("fiscal");
  const [from, setFrom] = useState<Date>(() => getDateRange("fiscal").from);
  const [to, setTo] = useState<Date>(() => getDateRange("fiscal").to);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Auto-update dates when dropdown changes
  useEffect(() => {
    const dr = getDateRange(dateOption);
    setFrom(dr.from);
    setTo(dr.to);
  }, [dateOption]);

  // Allow date manual change
  const handleFromChange = (date?: Date) => {
    if (date) setFrom(date);
    setOpenFrom(false);
  };
  const handleToChange = (date?: Date) => {
    if (date) setTo(date);
    setOpenTo(false);
  };

  const handleOk = () => {
    setShowResults(true);
    if (onOk) onOk(from, to);
  };

  const handleCancel = () => {
    setDateOption("fiscal");
    const dr = getDateRange("fiscal");
    setFrom(dr.from);
    setTo(dr.to);
    setShowResults(false);
    if (onCancel) onCancel();
  };

  const handleExport = () => {
    if (onExport) onExport(from, to);
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Donations Report</h1>
      </div>

      <StandardizedFilterCard>
        {/* Filter Table */}
        <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
          <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-300">
            <div className="p-4 border-r border-gray-300 text-center font-semibold text-gray-700">Column</div>
            <div className="p-4 border-r border-gray-300 text-center font-semibold text-gray-700">From</div>
            <div className="p-4 text-center font-semibold text-gray-700">To</div>
          </div>
          <div className="grid grid-cols-3 bg-white">
            {/* Column Label */}
            <div className="p-4 border-r border-gray-300 bg-gray-50 flex items-center justify-start font-medium text-gray-700">
              <Label className="font-medium">Dates:</Label>
              <Select value={dateOption} onValueChange={v => setDateOption(v as DateOption)}>
                <SelectTrigger className="ml-2 w-36 h-10 bg-white shadow-none border border-gray-300 focus:ring-0 text-base">
                  <SelectValue>
                    {DATE_OPTIONS.find(opt => opt.value === dateOption)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="z-50 bg-white" side="bottom">
                  {DATE_OPTIONS.map(opt => (
                    <SelectItem value={opt.value} key={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* From Date */}
            <div className="p-4 border-r border-gray-300 flex items-center">
              <Popover open={openFrom} onOpenChange={setOpenFrom}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-start pl-3 pr-2 text-base flex items-center gap-2 rounded border shadow-none bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <CalendarIcon className="h-5 w-5 text-gray-600" />
                    <span>{formatDMY(from)}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-30" align="start">
                  <Calendar
                    mode="single"
                    selected={from}
                    onSelect={handleFromChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* To Date */}
            <div className="p-4 flex items-center">
              <Popover open={openTo} onOpenChange={setOpenTo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-start pl-3 pr-2 text-base flex items-center gap-2 rounded border shadow-none bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <CalendarIcon className="h-5 w-5 text-gray-600" />
                    <span>{formatDMY(to)}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-30" align="start">
                  <Calendar
                    mode="single"
                    selected={to}
                    onSelect={handleToChange}
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
