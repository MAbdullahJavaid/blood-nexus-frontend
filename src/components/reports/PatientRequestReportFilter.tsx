
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, FileText, Calendar as CalendarIcon } from "lucide-react";
import { DocumentSearchModal } from "@/components/forms/patient-invoice/DocumentSearchModal";
import { cn } from "@/lib/utils";

const PatientRequestReportFilter = () => {
  const navigate = useNavigate();
  const [invoiceNoFrom, setInvoiceNoFrom] = useState("");
  const [invoiceNoTo, setInvoiceNoTo] = useState("");
  const [fiscalYear, setFiscalYear] = useState("2024-25");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);

  const handleDocumentSelect = (docNum: string, isFromField: boolean) => {
    if (isFromField) {
      setInvoiceNoFrom(docNum);
      setIsFromModalOpen(false);
    } else {
      setInvoiceNoTo(docNum);
      setIsToModalOpen(false);
    }
  };

  const handleFiscalYearChange = (year: string) => {
    setFiscalYear(year);
    // Auto-adjust dates based on fiscal year
    const startYear = parseInt(year.split('-')[0]);
    const endYear = startYear + 1;
    setFromDate(new Date(startYear, 3, 1)); // April 1st
    setToDate(new Date(endYear, 2, 31)); // March 31st
  };

  const handleOK = () => {
    console.log("Applying filters:", {
      invoiceNoFrom,
      invoiceNoTo,
      fiscalYear,
      fromDate,
      toDate
    });
    // This will be connected to actual data fetching later
  };

  const handleCancel = () => {
    setInvoiceNoFrom("");
    setInvoiceNoTo("");
    setFiscalYear("2024-25");
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleExport = () => {
    console.log("Exporting report...");
    // Export functionality will be implemented later
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Patient Request Summary Report</h1>
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

              {/* Invoice No Row */}
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">Invoice No:</Label>
                </div>
                <div className="p-3 border-r">
                  <div className="flex items-center gap-2">
                    <Input
                      value={invoiceNoFrom}
                      onChange={(e) => setInvoiceNoFrom(e.target.value)}
                      placeholder=""
                      className="flex-1"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFromModalOpen(true)}
                      className="p-2"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={invoiceNoTo}
                      onChange={(e) => setInvoiceNoTo(e.target.value)}
                      placeholder=""
                      className="flex-1"
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsToModalOpen(true)}
                      className="p-2"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Fiscal Year Row */}
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">Fiscal Year:</Label>
                </div>
                <div className="p-3 border-r">
                  <Select value={fiscalYear} onValueChange={handleFiscalYearChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select fiscal year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2022-23">2022-23</SelectItem>
                      <SelectItem value="2021-22">2021-22</SelectItem>
                      <SelectItem value="2020-21">2020-21</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3">
                  {/* Empty cell for fiscal year end */}
                </div>
              </div>

              {/* From Date Row */}
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">From Date:</Label>
                </div>
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
                        {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
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
                <div className="p-3">
                  {/* Empty cell */}
                </div>
              </div>

              {/* To Date Row */}
              <div className="grid grid-cols-3">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">To Date:</Label>
                </div>
                <div className="p-3 border-r">
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
                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
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
                <div className="p-3">
                  {/* Empty cell */}
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
              <Button onClick={handleExport} className="px-8 bg-green-600 hover:bg-green-700">
                Export
              </Button>
              <Button variant="outline" onClick={handleExit} className="px-8">
                Exit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Modals */}
      <DocumentSearchModal
        isOpen={isFromModalOpen}
        onOpenChange={setIsFromModalOpen}
        onDocumentSelect={(docNum) => handleDocumentSelect(docNum, true)}
      />
      
      <DocumentSearchModal
        isOpen={isToModalOpen}
        onOpenChange={setIsToModalOpen}
        onDocumentSelect={(docNum) => handleDocumentSelect(docNum, false)}
      />

      {/* Results Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Report Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results found. Use the filters above to generate the patient request summary report.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRequestReportFilter;
