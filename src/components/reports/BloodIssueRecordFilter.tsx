
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface BloodIssueRecordFilterProps {
  title: string;
}

const BloodIssueRecordFilter = ({ title }: BloodIssueRecordFilterProps) => {
  const [category, setCategory] = useState("All");
  const [dateRange, setDateRange] = useState("This Fiscal Year");
  const [fromDate, setFromDate] = useState("01/07/2024");
  const [toDate, setToDate] = useState("30/06/2025");

  const handleOK = () => {
    console.log("Applying filters:", {
      category,
      dateRange,
      fromDate,
      toDate
    });
    // This will be connected to actual data fetching later
  };

  const handleCancel = () => {
    setCategory("All");
    setDateRange("This Fiscal Year");
    setFromDate("01/07/2024");
    setToDate("30/06/2025");
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

              {/* Category Row */}
              <div className="grid grid-cols-3 border-b">
                <div className="p-3 border-r bg-gray-50 flex items-center">
                  <Label className="font-medium">Category:</Label>
                </div>
                <div className="p-3 border-r">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">&lt;All&gt;</SelectItem>
                      <SelectItem value="FWB">FWB</SelectItem>
                      <SelectItem value="WB">WB</SelectItem>
                      <SelectItem value="FFP">FFP</SelectItem>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="PLT">PLT</SelectItem>
                      <SelectItem value="MEGAUNIT">MEGAUNIT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3">
                  <span className="text-gray-400">?</span>
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-3">
                <div className="p-3 border-r bg-gray-50 flex items-center">
                  <Label className="font-medium">Dates:</Label>
                </div>
                <div className="p-3 border-r">
                  <div className="space-y-2">
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="This Fiscal Year">This Fiscal Year</SelectItem>
                        <SelectItem value="Custom Range">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={fromDate} onValueChange={setFromDate}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01/07/2024">01/07/2024</SelectItem>
                        <SelectItem value="01/01/2024">01/01/2024</SelectItem>
                        <SelectItem value="01/04/2024">01/04/2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-3">
                  <div className="space-y-2">
                    <span className="text-gray-400">?</span>
                    <Select value={toDate} onValueChange={setToDate}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30/06/2025">30/06/2025</SelectItem>
                        <SelectItem value="31/12/2024">31/12/2024</SelectItem>
                        <SelectItem value="31/03/2025">31/03/2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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

export default BloodIssueRecordFilter;
