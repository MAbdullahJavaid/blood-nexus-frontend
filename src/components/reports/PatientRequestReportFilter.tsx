
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText } from "lucide-react";
import { DocumentSearchModal } from "@/components/forms/patient-invoice/DocumentSearchModal";

const PatientRequestReportFilter = () => {
  const [invoiceNoFrom, setInvoiceNoFrom] = useState("");
  const [invoiceNoTo, setInvoiceNoTo] = useState("");
  const [dateFilter, setDateFilter] = useState("");
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

  const handleOK = () => {
    console.log("Applying filters:", {
      invoiceNoFrom,
      invoiceNoTo,
      dateFilter
    });
    // This will be connected to actual data fetching later
  };

  const handleCancel = () => {
    setInvoiceNoFrom("");
    setInvoiceNoTo("");
    setDateFilter("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Patient Request Summary Report</h1>
      </div>

      {/* Filter Card */}
      <Card className="max-w-2xl mx-auto">
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

              {/* Dates Row */}
              <div className="grid grid-cols-3">
                <div className="p-3 border-r bg-gray-50">
                  <Label className="font-medium">Dates:</Label>
                </div>
                <div className="p-3 border-r">
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
                </div>
                <div className="p-3">
                  {/* Empty cell for date range end */}
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
