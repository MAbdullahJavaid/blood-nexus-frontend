
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, FileText, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CrossmatchRecord {
  id: string;
  crossmatch_no: string;
  patient_name: string;
  date: string;
  hospital: string;
  blood_group: string;
  rh: string;
  result: string;
  albumin: string;
  saline: string;
  coomb: string;
  product_id: string;
  expiry_date: string;
  remarks: string;
}

interface CrossmatchReportFilterProps {
  title: string;
}

const CrossmatchReportFilter = ({ title }: CrossmatchReportFilterProps) => {
  const navigate = useNavigate();
  const [codeFrom, setCodeFrom] = useState("");
  const [codeTo, setCodeTo] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [crossmatchRecords, setCrossmatchRecords] = useState<CrossmatchRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<CrossmatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCrossmatchRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('crossmatch_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCrossmatchRecords(data || []);
      setFilteredRecords(data || []);
    } catch (error) {
      console.error("Error fetching crossmatch records:", error);
      toast.error("Failed to fetch crossmatch records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
    fetchCrossmatchRecords();
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = crossmatchRecords.filter(record =>
      record.crossmatch_no.toLowerCase().includes(term.toLowerCase()) ||
      record.patient_name.toLowerCase().includes(term.toLowerCase()) ||
      record.hospital?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredRecords(filtered);
  };

  const handleOK = () => {
    console.log("Applying filters:", {
      codeFrom,
      codeTo
    });
    
    if (codeFrom || codeTo) {
      const filtered = crossmatchRecords.filter(record => {
        const code = record.crossmatch_no;
        const meetsFromCondition = !codeFrom || code >= codeFrom;
        const meetsToCondition = !codeTo || code <= codeTo;
        return meetsFromCondition && meetsToCondition;
      });
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(crossmatchRecords);
    }
    
    toast.success("Filters applied successfully");
  };

  const handleCancel = () => {
    setCodeFrom("");
    setCodeTo("");
    setFilteredRecords(crossmatchRecords);
  };

  const handleExport = () => {
    console.log("Exporting crossmatch report...");
    toast.success("Export functionality will be implemented");
  };

  const handleExit = () => {
    navigate("/dashboard");
  };

  const handleEdit = (record: CrossmatchRecord) => {
    console.log("Edit record:", record);
    toast.success("Edit functionality will be implemented");
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm("Are you sure you want to delete this crossmatch record?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('crossmatch_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      toast.success("Crossmatch record deleted successfully");
      fetchCrossmatchRecords();
    } catch (error) {
      console.error("Error deleting crossmatch record:", error);
      toast.error("Failed to delete crossmatch record");
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
              <Search className="text-green-600 h-5 w-5" />
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

              {/* Code Row */}
              <div className="grid grid-cols-3">
                <div className="p-3 border-r bg-gray-50 flex items-center">
                  <Label className="font-medium">Code:</Label>
                </div>
                <div className="p-3 border-r">
                  <div className="flex items-center gap-2">
                    <Input
                      value={codeFrom}
                      onChange={(e) => setCodeFrom(e.target.value)}
                      placeholder="Enter code"
                      className="w-full"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSearchClick}
                      className="h-8 w-8 p-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={codeTo}
                      onChange={(e) => setCodeTo(e.target.value)}
                      placeholder="Enter code"
                      className="w-full"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSearchClick}
                      className="h-8 w-8 p-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={handleOK} className="px-8 bg-red-600 hover:bg-red-700">
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
      <Card>
        <CardHeader>
          <CardTitle>Crossmatch Report Results</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crossmatch No</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.crossmatch_no}</TableCell>
                      <TableCell>{record.patient_name}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.hospital}</TableCell>
                      <TableCell>{record.blood_group}{record.rh}</TableCell>
                      <TableCell>{record.result}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(record)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(record.id)}
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No crossmatch records found. Use the filters above to generate the report.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Search Crossmatch Records</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search by crossmatch number, patient name, or hospital" 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="mb-4"
            />
            <div className="h-96 border overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : filteredRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crossmatch No</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow 
                        key={record.id} 
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setCodeFrom(record.crossmatch_no);
                          setIsSearchModalOpen(false);
                        }}
                      >
                        <TableCell>{record.crossmatch_no}</TableCell>
                        <TableCell>{record.patient_name}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.hospital}</TableCell>
                        <TableCell>{record.result}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No crossmatch records found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrossmatchReportFilter;
