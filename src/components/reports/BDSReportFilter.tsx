
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

interface BDSReportFilterProps {
  title: string;
}

const BDSReportFilter = ({ title }: BDSReportFilterProps) => {
  const [dateFilter, setDateFilter] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const handleOK = () => {
    console.log("Applying filters:", {
      dateFilter,
      fromDate,
      toDate
    });
    // This will be connected to actual data fetching later
  };

  const handleCancel = () => {
    setDateFilter("");
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {/* Filter Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-yellow-100 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>📊</span>
            Report Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Filter Header */}
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
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">Dates:</Label>
                </div>
                <div className="p-3 border-r">
                  <div className="space-y-2">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="This Fiscal Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="this-fiscal-year">This Fiscal Year</SelectItem>
                      </SelectContent>
                    </Select>
                    
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
                </div>
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
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={handleOK} className="px-8">
                OK
              </Button>
              <Button variant="outline" onClick={handleCancel} className="px-8">
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Report Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results found. Use the filters above to generate the report.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BDSReportFilter;
