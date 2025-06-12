
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DonorScreeningReportFilterProps {
  title: string;
}

const DonorScreeningReportFilter = ({ title }: DonorScreeningReportFilterProps) => {
  const navigate = useNavigate();
  const [fromRegistrationNo, setFromRegistrationNo] = useState("");
  const [toRegistrationNo, setToRegistrationNo] = useState("");

  const handleOK = () => {
    console.log("Applying filters:", {
      fromRegistrationNo,
      toRegistrationNo
    });
    // This will be connected to actual data fetching later
  };

  const handleCancel = () => {
    setFromRegistrationNo("");
    setToRegistrationNo("");
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

              {/* Registration No Row */}
              <div className="grid grid-cols-3">
                <div className="p-3 border-r bg-gray-50 flex items-center">
                  <Label className="font-medium">Registration No:</Label>
                </div>
                <div className="p-3 border-r">
                  <Input
                    type="text"
                    value={fromRegistrationNo}
                    onChange={(e) => setFromRegistrationNo(e.target.value)}
                    placeholder="000000"
                    className="w-full"
                  />
                </div>
                <div className="p-3">
                  <Input
                    type="text"
                    value={toRegistrationNo}
                    onChange={(e) => setToRegistrationNo(e.target.value)}
                    placeholder="zzzzzz"
                    className="w-full"
                  />
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

export default DonorScreeningReportFilter;
