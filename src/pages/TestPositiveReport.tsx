
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import TestPositiveReportTable from "@/components/reports/TestPositiveReportTable";

const TestPositiveReport = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['test-positive-report', fromDate, toDate],
    queryFn: async () => {
      if (!showResults) return [];
      
      let query = supabase
        .from('bleeding_records')
        .select(`
          *,
          donors!inner (
            id,
            donor_id,
            name,
            phone,
            address,
            blood_group_separate,
            rh_factor,
            date_of_birth,
            gender
          )
        `);

      // Filter by date range
      if (fromDate) {
        query = query.gte('bleeding_date', fromDate);
      }
      if (toDate) {
        query = query.lte('bleeding_date', toDate);
      }

      const { data, error } = await query.order('bleeding_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching test positive data:', error);
        throw error;
      }

      // Filter for records with any positive screening results (>1.0)
      const positiveRecords = (data || []).filter(record => {
        const hbsag = parseFloat(record.hbsag) || 0;
        const hcv = parseFloat(record.hcv) || 0;
        const hiv = parseFloat(record.hiv) || 0;
        const vdrl = parseFloat(record.vdrl) || 0;
        
        return hbsag > 1.0 || hcv > 1.0 || hiv > 1.0 || vdrl > 1.0;
      });

      return positiveRecords;
    },
    enabled: showResults
  });

  const handleOK = () => {
    console.log("Applying filters:", { fromDate, toDate });
    setShowResults(true);
    refetch();
  };

  const handleCancel = () => {
    setFromDate("");
    setToDate("");
    setShowResults(false);
  };

  const handleExport = (format: 'pdf' | 'jpeg') => {
    if (!reportData || reportData.length === 0) {
      toast({
        title: "No Data",
        description: "No positive test results available for export.",
        variant: "destructive",
      });
      return;
    }
    
    // Trigger export from the report table component
    const event = new CustomEvent('exportTestPositive', { 
      detail: { format, data: reportData } 
    });
    window.dispatchEvent(event);
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Test Positive Report</h1>
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

                {/* Date Row */}
                <div className="grid grid-cols-3">
                  <div className="p-3 border-r bg-gray-50 flex items-center">
                    <Label className="font-medium">Date:</Label>
                  </div>
                  <div className="p-3 border-r">
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="p-3">
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button onClick={handleOK} className="px-8" disabled={isLoading}>
                  {isLoading ? "Loading..." : "OK"}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="px-8">
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleExport('pdf')} 
                  className="px-8 bg-green-600 hover:bg-green-700"
                  disabled={!showResults || !reportData || reportData.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button 
                  onClick={() => handleExport('jpeg')} 
                  variant="outline" 
                  className="px-8"
                  disabled={!showResults || !reportData || reportData.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export JPEG
                </Button>
                <Button variant="outline" onClick={handleExit} className="px-8">
                  Exit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        {showResults && reportData ? (
          <TestPositiveReportTable 
            data={reportData} 
            isLoading={isLoading}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Report Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found. Use the filters above to generate the test positive report.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestPositiveReport;
