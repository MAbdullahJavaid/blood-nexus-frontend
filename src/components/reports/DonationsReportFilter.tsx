
import React, { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, startOfToday, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, set, addYears, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
    if (onOk) onOk(from, to);
  };

  const handleCancel = () => {
    setDateOption("fiscal");
    const dr = getDateRange("fiscal");
    setFrom(dr.from);
    setTo(dr.to);
    if (onCancel) onCancel();
  };

  const handleExport = () => {
    if (onExport) onExport(from, to);
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  // Rendering
  return (
    <div className="bg-white rounded shadow border overflow-hidden max-w-2xl mx-auto mt-8">
      {/* Yellow Header */}
      <div className="bg-yellow-100 border-b border-yellow-200 px-5 py-2 flex items-center gap-2">
        <span>
          <img src="https://img.icons8.com/ios-filled/32/000000/combo-chart.png" alt="icon" className="inline-block mr-1" />
        </span>
        <h2 className="text-lg font-bold">Report Filter</h2>
      </div>

      {/* Main Filter UI */}
      <div className="p-6 pb-3">
        {/* Filter Title */}
        <div className="flex items-center gap-2 mb-4">
          <span>
            <svg width={20} height={20} fill="none" stroke="currentColor">
              <circle cx={9} cy={9} r={7} strokeWidth={2}/>
              <line x1="15" y1="15" x2="19" y2="19" strokeWidth={2}/>
            </svg>
          </span>
          <h3 className="font-semibold text-lg">Filter</h3>
        </div>
        {/* Filter Table */}
        <div className="rounded border overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-100 text-gray-700 font-semibold text-center py-2">
            <div className="col-span-1 border-r py-2">Column</div>
            <div className="col-span-1 border-r py-2">From</div>
            <div className="col-span-2 py-2">To</div>
          </div>
          <div className="grid grid-cols-4">
            {/* Column Label */}
            <div className="col-span-1 flex items-center border-r px-4 py-4 font-medium gap-2">
              <span>Dates:</span>
              <Select value={dateOption} onValueChange={v => setDateOption(v as DateOption)}>
                <SelectTrigger className="w-36 h-10 bg-white shadow-none border border-gray-300 focus:ring-0 text-base">
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
            <div className="col-span-1 border-r px-4 py-2 flex items-center">
              <Popover open={openFrom} onOpenChange={setOpenFrom}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-start pl-3 pr-2 text-base flex items-center gap-2 rounded border shadow-none bg-white"
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
            <div className="col-span-2 px-4 py-2 flex items-center">
              <Popover open={openTo} onOpenChange={setOpenTo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-start pl-3 pr-2 text-base flex items-center gap-2 rounded border shadow-none bg-white"
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

        {/* Standardized Footer Buttons */}
        <ReportFilterActions
          onOk={handleOk}
          onCancel={handleCancel}
          onExport={handleExport}
          onExit={handleExit}
        />
      </div>
    </div>
  );
}
