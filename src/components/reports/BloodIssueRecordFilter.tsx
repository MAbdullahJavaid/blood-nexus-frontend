import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import BloodIssueRecordTable from "./BloodIssueRecordTable";
import ProductWiseBloodIssueTable from "./ProductWiseBloodIssueTable";

interface BloodIssueRecordFilterProps {
  title: string;
}

const BloodIssueRecordFilter = ({ title }: BloodIssueRecordFilterProps) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [dateRange, setDateRange] = useState("This Fiscal Year");
  const [fromDate, setFromDate] = useState("01/07/2024");
  const [toDate, setToDate] = useState("30/06/2025");
  const [showResults, setShowResults] = useState(false);

  const getDateForOption = (option: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB').replace(/\//g, '/');
    };

    switch (option) {
      case "today":
        return { from: formatDate(today), to: formatDate(today) };
      case "yesterday":
        return { from: formatDate(yesterday), to: formatDate(yesterday) };
      case "this week":
        return { from: formatDate(startOfWeek), to: formatDate(today) };
      case "this month":
        return { from: formatDate(startOfMonth), to: formatDate(endOfMonth) };
      default:
        return { from: "01/07/2024", to: "30/06/2025" };
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
      category,
      dateRange,
      fromDate,
      toDate
    });
    setShowResults(true);
  };

  const handleCancel = () => {
    setCategory("All");
    setDateRange("This Fiscal Year");
    setFromDate("01/07/2024");
    setToDate("30/06/2025");
    setShowResults(false);
  };

  const handleExport = () => {
    console.log("Exporting report...");
    // Export functionality will be handled by the table component
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD format for database queries
  const convertToISODate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Determine which table component to render based on title
  const renderResultsTable = () => {
    if (title === "Product Wise Blood Issue") {
      return (
        <ProductWiseBloodIssueTable 
          category={category}
          fromDate={convertToISODate(fromDate)}
          toDate={convertToISODate(toDate)}
        />
      );
    } else {
      return (
        <BloodIssueRecordTable 
          category={category}
          fromDate={convertToISODate(fromDate)}
          toDate={convertToISODate(toDate)}
        />
      );
    }
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
                <div className="p-3 border-r">
                  <Select value={fromDate} onValueChange={setFromDate}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={fromDate}>{fromDate}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3">
                  <Select value={toDate} onValueChange={setToDate}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={toDate}>{toDate}</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* Results Table */}
      {showResults ? (
        renderResultsTable()
      ) : (
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
      )}
    </div>
  );
};

export default BloodIssueRecordFilter;
