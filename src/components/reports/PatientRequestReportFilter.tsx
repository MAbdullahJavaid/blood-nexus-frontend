
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, FileText, Download } from "lucide-react";

const PatientRequestReportFilter = () => {
  const [fromDocumentNo, setFromDocumentNo] = useState("");
  const [toDocumentNo, setToDocumentNo] = useState("");
  const [reportType, setReportType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSearch = () => {
    console.log("Searching with filters:", {
      fromDocumentNo,
      toDocumentNo,
      reportType,
      dateFrom,
      dateTo
    });
    // This will be connected to actual data fetching later
  };

  const handleReset = () => {
    setFromDocumentNo("");
    setToDocumentNo("");
    setReportType("all");
    setDateFrom("");
    setDateTo("");
  };

  const handleExport = () => {
    console.log("Exporting report data");
    // This will be connected to export functionality later
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Patient Request Report</h1>
      </div>

      {/* Filter Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Document Number Range */}
            <div className="space-y-2">
              <Label htmlFor="fromDocNo">From Document No</Label>
              <Input
                id="fromDocNo"
                placeholder="Enter document number"
                value={fromDocumentNo}
                onChange={(e) => setFromDocumentNo(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toDocNo">To Document No</Label>
              <Input
                id="toDocNo"
                placeholder="Enter document number"
                value={toDocumentNo}
                onChange={(e) => setToDocumentNo(e.target.value)}
              />
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {/* Report Type */}
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="opd">OPD</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results found. Use the filters above to search for patient request reports.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRequestReportFilter;
