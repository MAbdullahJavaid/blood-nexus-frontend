
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TestResult {
  test_id: number;
  test_name: string;
  quantity: number;
}

interface PreReport {
  document_no: string;
  patient_id: string | null;
  patient_name: string;
  type: string | null;
  registration_date: string;
  hospital_name: string | null;
  gender: string | null;
  dob: string | null;
  phone: string | null;
  age: number | null;
  reference: string | null;
  blood_group: string | null;
  rh: string | null;
  blood_category: string | null;
  bottle_required: number | null;
  tests_type: string | null;
  created_at: string;
  updated_at: string;
}

interface ReportDataEntryFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

const ReportDataEntryForm = ({ isSearchEnabled = true, isEditable = false }: ReportDataEntryFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<PreReport | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [reports, setReports] = useState<PreReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [testCategories, setTestCategories] = useState<string[]>([]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pre_report')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestCategories = async (testIds: number[]) => {
    if (testIds.length === 0) {
      setTestCategories([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('test_information')
        .select(`
          id,
          test_categories!inner(name)
        `)
        .in('id', testIds);

      if (error) throw error;

      const categories = data?.map(item => item.test_categories?.name).filter(Boolean) || [];
      const uniqueCategories = [...new Set(categories)] as string[];
      setTestCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching test categories:', error);
      setTestCategories([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report =>
    report.document_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
    if (reports.length === 0) {
      fetchReports();
    }
  };

  const handleReportSelect = async (report: PreReport) => {
    setSelectedReport(report);
    
    // Parse tests from JSON string
    if (report.tests_type) {
      try {
        const tests = JSON.parse(report.tests_type);
        setTestResults(tests || []);
        
        // Fetch test categories for the selected tests
        const testIds = tests.map((test: TestResult) => test.test_id).filter(Boolean);
        await fetchTestCategories(testIds);
      } catch (error) {
        console.error('Error parsing tests:', error);
        setTestResults([]);
        setTestCategories([]);
      }
    } else {
      setTestResults([]);
      setTestCategories([]);
    }
    
    setIsSearchModalOpen(false);
    toast.success(`Report for ${report.patient_name} loaded successfully`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('en-GB'); // DD/MM/YYYY HH:MM:SS format
  };

  return (
    <div className="bg-white p-6 rounded-md space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Test Result</h2>
      </div>

      {/* Test Categories Blue Bar */}
      {testCategories.length > 0 && (
        <div className="bg-blue-500 text-white p-3 rounded-md">
          <div className="font-medium">Test Categories:</div>
          <div className="text-sm">{testCategories.join(', ')}</div>
        </div>
      )}

      {/* Patient Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentNo" className="text-sm font-medium">
              Document No:
            </Label>
            <div className="flex gap-2">
              <Input
                id="documentNo"
                value={selectedReport?.document_no || ""}
                readOnly
                className="bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearchClick}
                className="px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="patientName" className="text-sm font-medium">
              Patient Name:
            </Label>
            <Input
              id="patientName"
              value={selectedReport?.patient_name || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="hospitalName" className="text-sm font-medium">
              Hospital Name:
            </Label>
            <Input
              id="hospitalName"
              value={selectedReport?.hospital_name || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNo" className="text-sm font-medium">
              Phone No:
            </Label>
            <Input
              id="phoneNo"
              value={selectedReport?.phone || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="bloodGroup" className="text-sm font-medium">
              Blood Group:
            </Label>
            <Input
              id="bloodGroup"
              value={selectedReport?.blood_group || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="patientId" className="text-sm font-medium">
              Patient ID:
            </Label>
            <Input
              id="patientId"
              value={selectedReport?.patient_id || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="type" className="text-sm font-medium">
              Type:
            </Label>
            <Select disabled>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder={selectedReport?.type || "Regular"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="opd">OPD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="gender" className="text-sm font-medium">
              Gender:
            </Label>
            <Select disabled>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder={selectedReport?.gender || "Male"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="age" className="text-sm font-medium">
              Age:
            </Label>
            <Input
              id="age"
              value={selectedReport?.age || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="rh" className="text-sm font-medium">
              RH:
            </Label>
            <Input
              id="rh"
              value={selectedReport?.rh || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Third Column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentDate" className="text-sm font-medium">
              Document Date:
            </Label>
            <Input
              id="documentDate"
              value={formatDate(selectedReport?.created_at)}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="registrationDate" className="text-sm font-medium">
              Registration Date:
            </Label>
            <Input
              id="registrationDate"
              value={formatDateTime(selectedReport?.registration_date)}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="dob" className="text-sm font-medium">
              DOB:
            </Label>
            <Input
              id="dob"
              value={formatDate(selectedReport?.dob)}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="references" className="text-sm font-medium">
              References:
            </Label>
            <Input
              id="references"
              value={selectedReport?.reference || ""}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="bloodCategory" className="text-sm font-medium">
                Blood Category:
              </Label>
              <Input
                id="bloodCategory"
                value={selectedReport?.blood_category || ""}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="bottleRequired" className="text-sm font-medium">
                Bottle Required:
              </Label>
              <div className="flex gap-1">
                <Input
                  id="bottleRequired"
                  value={selectedReport?.bottle_required || ""}
                  readOnly
                  className="bg-gray-50"
                />
                <span className="text-sm text-gray-600 flex items-center">bag</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results Table */}
      <div className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Test ID</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead className="w-20">M/U</TableHead>
              <TableHead className="w-24">Low Value</TableHead>
              <TableHead className="w-24">High Value</TableHead>
              <TableHead className="w-24">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testResults.length > 0 ? (
              testResults.map((test, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input value={test.test_id || ""} readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value={test.test_name || ""} readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value="" readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value="" readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value="" readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value="" readOnly className="bg-gray-50 h-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No test results available. Please select a document to view test data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Search by document number or patient name" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="h-64 border mt-4 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading reports...
                </div>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <div 
                    key={report.document_no} 
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleReportSelect(report)}
                  >
                    <div className="font-medium">Doc #: {report.document_no}</div>
                    <div className="text-sm text-gray-600">
                      Patient: {report.patient_name}, {report.gender}, {report.age} yrs
                    </div>
                    <div className="text-sm text-gray-600">
                      Hospital: {report.hospital_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Date: {formatDate(report.created_at)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No reports found
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDataEntryForm;
