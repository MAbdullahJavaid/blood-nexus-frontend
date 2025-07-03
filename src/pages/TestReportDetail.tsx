
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Calendar, User, Hospital } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TestResult {
  id: string;
  test_id: number;
  test_name: string;
  category: string | null;
  measuring_unit: string | null;
  low_value: string | null;
  high_value: string | null;
  user_value: string | null;
  low_flag: boolean | null;
  high_flag: boolean | null;
}

interface PatientReport {
  document_no: string;
  patient_name: string;
  patient_id: string | null;
  age: number | null;
  gender: string | null;
  hospital_name: string | null;
  phone: string | null;
  created_at: string | null;
  blood_group: string | null;
  rh: string | null;
}

const TestReportDetail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [patientInfo, setPatientInfo] = useState<PatientReport | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [availableReports, setAvailableReports] = useState<PatientReport[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch available reports for search
  const fetchAvailableReports = async () => {
    try {
      setSearchLoading(true);
      const { data, error } = await supabase
        .from("pre_report")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAvailableReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch available reports");
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch test results for selected document
  const fetchTestResults = async (documentNo: string) => {
    try {
      setLoading(true);
      
      // Fetch patient info
      const { data: patientData, error: patientError } = await supabase
        .from("pre_report")
        .select("*")
        .eq("document_no", documentNo)
        .single();

      if (patientError) throw patientError;
      setPatientInfo(patientData);

      // Fetch test results
      const { data: resultsData, error: resultsError } = await supabase
        .from("test_report_results")
        .select("*")
        .eq("document_no", documentNo)
        .order("category", { ascending: true })
        .order("test_name", { ascending: true });

      if (resultsError) throw resultsError;
      setTestResults(resultsData || []);

    } catch (error) {
      console.error("Error fetching test results:", error);
      toast.error("Failed to fetch test results");
    } finally {
      setLoading(false);
    }
  };

  // Group test results by category
  const groupedResults = testResults.reduce((acc, result) => {
    const category = result.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);

  // Filter reports based on search term
  const filteredReports = availableReports.filter(
    (report) =>
      report.document_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.patient_id && report.patient_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReportSelect = (report: PatientReport) => {
    setSelectedDocument(report.document_no);
    setIsSearchModalOpen(false);
    fetchTestResults(report.document_no);
    toast.success(`Test report loaded for ${report.patient_name}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getResultStatus = (result: TestResult) => {
    if (result.high_flag) return { status: "high", color: "destructive" };
    if (result.low_flag) return { status: "low", color: "secondary" };
    return { status: "normal", color: "default" };
  };

  useEffect(() => {
    fetchAvailableReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Test Report Detail</h1>
          </div>
          <Button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Reports
          </Button>
        </div>

        {/* Patient Information Card */}
        {patientInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Document No:</Label>
                  <p className="font-semibold">{patientInfo.document_no}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Patient Name:</Label>
                  <p className="font-semibold">{patientInfo.patient_name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Patient ID:</Label>
                  <p className="font-semibold">{patientInfo.patient_id || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Age:</Label>
                  <p className="font-semibold">{patientInfo.age || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Gender:</Label>
                  <p className="font-semibold">{patientInfo.gender || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Phone:</Label>
                  <p className="font-semibold">{patientInfo.phone || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Hospital:</Label>
                  <p className="font-semibold flex items-center gap-1">
                    <Hospital className="h-4 w-4" />
                    {patientInfo.hospital_name || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Blood Group:</Label>
                  <p className="font-semibold">
                    {patientInfo.blood_group && patientInfo.rh 
                      ? `${patientInfo.blood_group} ${patientInfo.rh}` 
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Report Date:</Label>
                  <p className="font-semibold flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(patientInfo.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results by Category */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading test results...</p>
              </div>
            </CardContent>
          </Card>
        ) : Object.keys(groupedResults).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedResults).map(([category, results]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium">Test Name</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium">Result</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium">Unit</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium">Reference Range</th>
                          <th className="border border-gray-200 px-4 py-3 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result) => {
                          const resultStatus = getResultStatus(result);
                          return (
                            <tr key={result.id} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 font-medium">
                                {result.test_name}
                              </td>
                              <td className="border border-gray-200 px-4 py-3">
                                <span className={`font-semibold ${
                                  resultStatus.status === "high" ? "text-red-600" :
                                  resultStatus.status === "low" ? "text-orange-600" :
                                  "text-green-600"
                                }`}>
                                  {result.user_value || "Not Available"}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3">
                                {result.measuring_unit || "N/A"}
                              </td>
                              <td className="border border-gray-200 px-4 py-3">
                                {result.low_value && result.high_value 
                                  ? `${result.low_value} - ${result.high_value}`
                                  : "N/A"
                                }
                              </td>
                              <td className="border border-gray-200 px-4 py-3">
                                <Badge variant={resultStatus.color as any}>
                                  {resultStatus.status === "high" ? "High" :
                                   resultStatus.status === "low" ? "Low" : "Normal"}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : selectedDocument ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No test results found for this document.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Test results may not have been entered yet.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Select a document to view test results</p>
                <Button onClick={() => setIsSearchModalOpen(true)}>
                  Search Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Modal */}
        <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Select Test Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Search by document number, patient name, or patient ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <div className="max-h-96 overflow-y-auto border rounded-md">
                {searchLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading reports...</span>
                  </div>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <div
                      key={report.document_no}
                      className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleReportSelect(report)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-semibold text-blue-600">
                            Document: {report.document_no}
                          </p>
                          <p className="font-medium">{report.patient_name}</p>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>ID: {report.patient_id || "N/A"}</span>
                            <span>Age: {report.age || "N/A"}</span>
                            <span>Gender: {report.gender || "N/A"}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Hospital: {report.hospital_name || "N/A"}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{formatDate(report.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No reports found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TestReportDetail;
