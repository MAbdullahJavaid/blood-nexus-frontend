
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import StandardizedFilterCard from "@/components/reports/StandardizedFilterCard";
import StandardizedResultsCard from "@/components/reports/StandardizedResultsCard";
import ReportFilterActions from "@/components/reports/ReportFilterActions";

interface LABDateReportFilterProps {
  title: string;
}

const LABDateReportFilter = ({ title }: LABDateReportFilterProps) => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("This Fiscal Year");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const getDateForOption = (option: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    switch (option) {
      case "today":
        return { from: today, to: today };
      case "yesterday":
        return { from: yesterday, to: yesterday };
      case "this week":
        return { from: startOfWeek, to: today };
      case "this month":
        return { from: startOfMonth, to: endOfMonth };
      default:
        return { from: new Date(2024, 6, 1), to: new Date(2025, 5, 30) };
    }
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    const dates = getDateForOption(value);
    setFromDate(dates.from);
    setToDate(dates.to);
  };

  const handleOK = () => {
    console.log("Applying filters:", {
      dateRange,
      fromDate,
      toDate
    });
    setShowResults(true);
  };

  const handleCancel = () => {
    setDateRange("This Fiscal Year");
    setFromDate(undefined);
    setToDate(undefined);
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

          {/* Dates Row */}
          <div className="grid grid-cols-3 bg-white">
            <div className="p-4 border-r border-gray-300 bg-gray-50 flex items-center justify-start font-medium text-gray-700">
              <Label className="font-medium">Dates:</Label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="ml-2 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="This Fiscal Year">This Fiscal Year</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this week">This Week</SelectItem>
                  <SelectItem value="this month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 border-r border-gray-300">
              <Popover open={fromOpen} onOpenChange={setFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border border-gray-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "dd/MM/yyyy") : "01/07/2024"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => {
                      setFromDate(date);
                      setFromOpen(false);
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-4">
              <Popover open={toOpen} onOpenChange={setToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border border-gray-300 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "dd/MM/yyyy") : "30/06/2025"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => {
                      setToDate(date);
                      setToOpen(false);
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
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

export default LABDateReportFilter;
