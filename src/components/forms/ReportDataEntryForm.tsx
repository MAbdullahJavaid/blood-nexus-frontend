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
import PatientRequestFilter from "./PatientRequestFilter";

interface TestResult {
  test_id: number;
  test_name: string;
  quantity: number;
  type?: string;
  category?: string;
  measuring_unit?: string;
  low_value?: string;
  high_value?: string;
  user_value?: string;
}

interface LoadedTestResult {
  test_id: number;
  test_name: string;
  measuring_unit: string;
  low_value: string;
  high_value: string;
  user_value: string;
  category: string;
  is_category_header?: boolean;
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
  category: string | null;
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
  const [loadedTestResults, setLoadedTestResults] = useState<LoadedTestResult[]>([]);
  const [reports, setReports] = useState<PreReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PreReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pre_report')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
      setFilteredReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleApplyFilter = (fromDocNo: string, toDocNo: string) => {
    if (!fromDocNo && !toDocNo) {
      setFilteredReports(reports);
      setFilterApplied(false);
      return;
    }

    const filtered = reports.filter(report => {
      const docNo = report.document_no;
      
      if (fromDocNo && toDocNo) {
        return docNo >= fromDocNo && docNo <= toDocNo;
      } else if (fromDocNo) {
        return docNo >= fromDocNo;
      } else if (toDocNo) {
        return docNo <= toDocNo;
      }
      
      return true;
    });

    setFilteredReports(filtered);
    setFilterApplied(true);
    toast.success(`Filter applied: ${filtered.length} reports found`);
  };

  const getDisplayReports = () => {
    if (!searchTerm) return filteredReports;
    
    return filteredReports.filter(report =>
      report.document_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const loadTestsBasedOnType = async (selectedTests: TestResult[]) => {
    try {
      const allLoadedTests: LoadedTestResult[] = [];
      const processedCategories = new Set<string>();

      for (const selectedTest of selectedTests) {
        console.log('Processing test:', selectedTest);
        
        // Get test information from database to check type
        const { data: testInfo, error } = await supabase
          .from('test_information')
          .select(`
            id,
            name,
            test_type,
            category_id,
            test_categories (
              name
            )
          `)
          .eq('id', selectedTest.test_id)
          .single();

        if (error) {
          console.error('Error fetching test info:', error);
          continue;
        }

        const categoryName = testInfo.test_categories?.name || 'Unknown Category';
        
        if (testInfo.test_type === 'full') {
          // Load all tests with the same category
          if (!processedCategories.has(categoryName)) {
            const { data: categoryTests, error: categoryError } = await supabase
              .from('test_information')
              .select(`
                id,
                name,
                test_categories (
                  name
                )
              `)
              .eq('category_id', testInfo.category_id);

            if (categoryError) {
              console.error('Error fetching category tests:', categoryError);
              continue;
            }

            // Add category header
            allLoadedTests.push({
              test_id: 0,
              test_name: categoryName,
              measuring_unit: '',
              low_value: '',
              high_value: '',
              user_value: '',
              category: categoryName,
              is_category_header: true
            });

            // Add all tests in this category
            categoryTests?.forEach(test => {
              allLoadedTests.push({
                test_id: test.id,
                test_name: test.name,
                measuring_unit: '', // This would come from test details if available
                low_value: '', // This would come from test reference ranges if available
                high_value: '', // This would come from test reference ranges if available
                user_value: '',
                category: categoryName
              });
            });

            processedCategories.add(categoryName);
          }
        } else {
          // Load only the single test
          if (!processedCategories.has(categoryName)) {
            // Add category header
            allLoadedTests.push({
              test_id: 0,
              test_name: categoryName,
              measuring_unit: '',
              low_value: '',
              high_value: '',
              user_value: '',
              category: categoryName,
              is_category_header: true
            });
            processedCategories.add(categoryName);
          }

          allLoadedTests.push({
            test_id: testInfo.id,
            test_name: testInfo.name,
            measuring_unit: '', // This would come from test details if available
            low_value: '', // This would come from test reference ranges if available
            high_value: '', // This would come from test reference ranges if available
            user_value: '',
            category: categoryName
          });
        }
      }

      setLoadedTestResults(allLoadedTests);
    } catch (error) {
      console.error('Error loading tests:', error);
      toast.error('Failed to load test details');
    }
  };

  const handleReportSelect = async (report: PreReport) => {
    setSelectedReport(report);
    
    // Parse tests from JSON string
    if (report.tests_type) {
      try {
        const tests = JSON.parse(report.tests_type);
        setTestResults(tests || []);
        
        // Load tests based on their type
        if (tests && tests.length > 0) {
          await loadTestsBasedOnType(tests);
        }
      } catch (error) {
        console.error('Error parsing tests:', error);
        setTestResults([]);
        setLoadedTestResults([]);
      }
    } else {
      setTestResults([]);
      setLoadedTestResults([]);
    }
    
    setIsSearchModalOpen(false);
    toast.success(`Report for ${report.patient_name} loaded successfully`);
  };

  const handleValueChange = (testId: number, value: string) => {
    setLoadedTestResults(prev => 
      prev.map(test => 
        test.test_id === testId 
          ? { ...test, user_value: value }
          : test
      )
    );
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
      {/* Header with Filter */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Test Result</h2>
          <div className="flex items-center gap-2">
            <PatientRequestFilter onApplyFilter={handleApplyFilter} />
            {filterApplied && (
              <Button
                variant="ghost"
                onClick={() => handleApplyFilter("", "")}
                className="text-sm text-gray-600"
              >
                Clear Filter
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Test Categories and Type Blue Bar */}
      {(selectedReport?.category || selectedReport?.type) && (
        <div className="bg-blue-500 text-white p-3 rounded-md space-y-1">
          {selectedReport.category && (
            <div>
              <span className="font-medium">Test Categories: </span>
              <span className="text-sm">{selectedReport.category}</span>
            </div>
          )}
          {selectedReport.type && (
            <div>
              <span className="font-medium">Test Types: </span>
              <span className="text-sm">{selectedReport.type}</span>
            </div>
          )}
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
              <TableHead className="w-24">M/U</TableHead>
              <TableHead className="w-24">Low Value</TableHead>
              <TableHead className="w-24">High Value</TableHead>
              <TableHead className="w-32">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadedTestResults.length > 0 ? (
              loadedTestResults.map((test, index) => (
                <TableRow 
                  key={`${test.test_id}-${index}`}
                  className={test.is_category_header ? "bg-blue-500 text-white" : ""}
                >
                  {test.is_category_header ? (
                    <TableCell colSpan={6} className="font-medium text-center py-2">
                      {test.test_name}
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>
                        <Input value={test.test_id.toString()} readOnly className="bg-gray-50 h-8" />
                      </TableCell>
                      <TableCell>
                        <Input value={test.test_name} readOnly className="bg-gray-50 h-8" />
                      </TableCell>
                      <TableCell>
                        <Input value={test.measuring_unit} readOnly className="bg-gray-50 h-8" />
                      </TableCell>
                      <TableCell>
                        <Input value={test.low_value} readOnly className="bg-gray-50 h-8" />
                      </TableCell>
                      <TableCell>
                        <Input value={test.high_value} readOnly className="bg-gray-50 h-8" />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={test.user_value} 
                          onChange={(e) => handleValueChange(test.test_id, e.target.value)}
                          className="h-8" 
                          placeholder="Enter value"
                        />
                      </TableCell>
                    </>
                  )}
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
              ) : getDisplayReports().length > 0 ? (
                getDisplayReports().map((report) => (
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
                  {filterApplied ? "No reports found matching the filter criteria" : "No reports found"}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  function handleSearchClick() {
    setIsSearchModalOpen(true);
    if (reports.length === 0) {
      fetchReports();
    }
  }
};

export default ReportDataEntryForm;

}
