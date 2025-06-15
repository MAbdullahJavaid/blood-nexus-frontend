
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FileText, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Handle preset select
  const handlePresetChange = (preset: string) => {
    setDatePreset(preset);
    const range = getPresetRange(preset);
    setFromDate(range.from);
    setToDate(range.to);
  };

  // Button handlers
  const handleOk = () => {
    if (onOk) onOk(fromDate, toDate);
  };
  const handleCancel = () => {
    setDatePreset("thisFiscalYear");
    setFromDate(fiscalYearStart);
    setToDate(fiscalYearEnd);
    if (onCancel) onCancel();
  };
  const handleExport = () => {
    if (onExport) onExport();
  };
  const handleExit = () => {
    if (onExit) onExit();
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader className="bg-yellow-100 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="text-primary w-5 h-5" />
          Report Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Filter header */}
        <div className="flex items-center gap-2 pb-2">
          <span className="text-green-600">🔍</span>
          <span className="font-medium">Filter</span>
        </div>
        {/* Filter Table */}
        <div className="border border-gray-300">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gray-200 border-b">
            <div className="p-3 border-r text-center font-medium">Column</div>
            <div className="p-3 border-r text-center font-medium">From</div>
            <div className="p-3 text-center font-medium">To</div>
          </div>
          {/* Dates Row */}
          <div className="grid grid-cols-3">
            {/* Column name and Quick Picker */}
            <div className="p-3 border-r bg-gray-50 flex items-center">
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
            <div className="p-3 border-r">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
            <div className="p-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          <Button onClick={handleOk} className="px-8 bg-red-600 hover:bg-red-700" type="button">
            OK
          </Button>
          <Button variant="outline" onClick={handleCancel} className="px-8" type="button">
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            className="px-8 bg-green-600 hover:bg-green-700 text-white"
            type="button"
          >
            Export
          </Button>
          <Button variant="outline" onClick={handleExit} className="px-8" type="button">
            Exit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
