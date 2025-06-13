
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, SearchIcon, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import DonorScreeningSearchModal from "./DonorScreeningSearchModal";
import DonorScreeningReportTable from "./DonorScreeningReportTable";

interface DonorScreeningReportFilterProps {
  title: string;
}

const DonorScreeningReportFilter = ({ title }: DonorScreeningReportFilterProps) => {
  const navigate = useNavigate();
  const [fromRegistrationNo, setFromRegistrationNo] = useState("");
  const [toRegistrationNo, setToRegistrationNo] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedDonorIds, setSelectedDonorIds] = useState<string[]>([]);

  const { data: screeningData, isLoading, refetch } = useQuery({
    queryKey: ['donor-screening', fromRegistrationNo, toRegistrationNo, selectedDonorIds],
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

      // Filter by registration number range
      if (fromRegistrationNo) {
        query = query.gte('donors.donor_id', fromRegistrationNo);
      }
      if (toRegistrationNo) {
        query = query.lte('donors.donor_id', toRegistrationNo);
      }

      // Filter by selected donor IDs if any
      if (selectedDonorIds.length > 0) {
        query = query.in('donor_id', selectedDonorIds);
      }

      const { data, error } = await query.order('bleeding_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching screening data:', error);
        throw error;
      }

      return data || [];
    },
    enabled: showResults
  });

  const handleOK = () => {
    console.log("Applying filters:", {
      fromRegistrationNo,
      toRegistrationNo,
      selectedDonorIds
    });
    setShowResults(true);
    refetch();
  };

  const handleCancel = () => {
    setFromRegistrationNo("");
    setToRegistrationNo("");
    setSelectedDonorIds([]);
    setShowResults(false);
  };

  const handleExport = (format: 'pdf' | 'jpeg') => {
    if (!screeningData || screeningData.length === 0) {
      toast({
        title: "No Data",
        description: "No screening data available for export.",
        variant: "destructive",
      });
      return;
    }
    
    // Trigger export from the report table component
    const event = new CustomEvent('exportDonorScreening', { 
      detail: { format, data: screeningData } 
    });
    window.dispatchEvent(event);
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  const handleDonorSelect = (donorIds: string[]) => {
    setSelectedDonorIds(donorIds);
    toast({
      title: "Donors Selected",
      description: `Selected ${donorIds.length} donor(s) for screening report.`,
    });
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
                  <button 
                    type="button"
                    onClick={() => setIsSearchModalOpen(true)}
                    className="ml-2 bg-gray-200 p-1 rounded hover:bg-gray-300"
                    title="Search donors from bleeding records"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </button>
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

            {/* Selected Donors Display */}
            {selectedDonorIds.length > 0 && (
              <div className="bg-blue-50 p-3 rounded border">
                <Label className="font-medium">Selected Donors: {selectedDonorIds.length}</Label>
                <div className="text-sm text-gray-600 mt-1">
                  Click OK to generate screening reports for selected donors
                </div>
              </div>
            )}

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
                disabled={!showResults || !screeningData || screeningData.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                onClick={() => handleExport('jpeg')} 
                variant="outline" 
                className="px-8"
                disabled={!showResults || !screeningData || screeningData.length === 0}
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
      {showResults && screeningData ? (
        <DonorScreeningReportTable 
          data={screeningData} 
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
              <p>No results found. Use the filters above to generate the screening report.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Donor Search Modal */}
      <DonorScreeningSearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={handleDonorSelect}
      />
    </div>
  );
};

export default DonorScreeningReportFilter;
