import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
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
  tests_type?: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

interface ReportDataEntryFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
  isDeleting?: boolean;
}

const ReportDataEntryForm = forwardRef(({
  isSearchEnabled = true,
  isEditable = false,
  isDeleting = false,
}: ReportDataEntryFormProps, ref) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<PreReport | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadedTestResults, setLoadedTestResults] = useState<LoadedTestResult[]>([]);
  const [reports, setReports] = useState<PreReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pre_report")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      report.document_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGenderBasedValues = (testInfo: any, gender: string | null) => {
    if (!testInfo?.description) return { measuring_unit: "", low_value: "", high_value: "" };
    
    try {
      const desc = JSON.parse(testInfo.description);
      const genderKey = gender?.toLowerCase() || 'other';
      
      let low_value = "";
      let high_value = "";
      
      if (genderKey === 'male') {
        low_value = desc.male_low_value || desc.low_value || "";
        high_value = desc.male_high_value || desc.high_value || "";
      } else if (genderKey === 'female') {
        low_value = desc.female_low_value || desc.low_value || "";
        high_value = desc.female_high_value || desc.high_value || "";
      } else {
        low_value = desc.other_low_value || desc.low_value || "";
        high_value = desc.other_high_value || desc.high_value || "";
      }
      
      return {
        measuring_unit: desc.measuring_unit || "",
        low_value,
        high_value
      };
    } catch {
      return { measuring_unit: "", low_value: "", high_value: "" };
    }
  };

  const loadTestsFromInvoiceItems = async (documentNo: string) => {
    try {
      const { data: invoiceData, error: invError } = await supabase
        .from("patient_invoices")
        .select("id")
        .eq("document_no", documentNo)
        .maybeSingle();

      if (invError) throw invError;
      if (!invoiceData?.id) {
        setLoadedTestResults([]);
        toast.error("No invoice found for this document");
        return;
      }

      const { data: invoiceItems, error: itemsError } = await supabase
        .from("invoice_items")
        .select(`test_id, test_name, type, category, quantity, unit_price, id`)
        .eq("invoice_id", invoiceData.id);

      if (itemsError) throw itemsError;
      if (!invoiceItems || invoiceItems.length === 0) {
        setLoadedTestResults([]);
        toast.error("No tests found in invoice items for this document");
        return;
      }

      const { data: existingResults, error: resultsError } = await supabase
        .from("test_report_results")
        .select("*")
        .eq("document_no", documentNo);

      if (resultsError) throw resultsError;

      const existingResultsMap = new Map(
        (existingResults || []).map(result => [result.test_id, result])
      );

      const loadedTestsMap: { [key: string]: LoadedTestResult } = {};

      const fullCategoryTests = invoiceItems
        .filter((item: any) => (item.type || '').toLowerCase() === "full" && item.category)
        .map((item: any) => ({
          test_id: item.test_id,
          category: item.category
        }));

      const fullTestIdCategorySet = new Set(
        fullCategoryTests.map(t => `${t.test_id}___${t.category}`)
      );

      for (const { test_id: fullTestId, category: categoryName } of fullCategoryTests) {
        const { data: categoryRow, error: catError } = await supabase
          .from("test_categories")
          .select("id")
          .eq("name", categoryName)
          .maybeSingle();
        if (catError || !categoryRow?.id) continue;

        const { data: testInfoRows, error: testInfoError } = await supabase
          .from("test_information")
          .select("id, name, description, category_id")
          .eq("category_id", categoryRow.id);

        if (testInfoError || !testInfoRows) continue;

        for (const test of testInfoRows) {
          if (test.id === fullTestId) continue;
          
          const genderValues = getGenderBasedValues(test, selectedReport?.gender);
          const compositeKey = `${test.id}___${categoryName}`;
          const existingResult = existingResultsMap.get(test.id);
          
          loadedTestsMap[compositeKey] = {
            test_id: test.id,
            test_name: test.name,
            category: categoryName,
            measuring_unit: genderValues.measuring_unit,
            low_value: genderValues.low_value,
            high_value: genderValues.high_value,
            user_value: existingResult?.user_value || "",
          };
        }
      }

      for (const item of invoiceItems) {
        const test_id = item.test_id;
        const category = item.category || "";
        const compositeKey = `${test_id}___${category}`;
        
        if (loadedTestsMap[compositeKey]) continue;
        if (fullTestIdCategorySet.has(compositeKey)) continue;

        let test_name = item.test_name || "";
        let genderValues = { measuring_unit: "", low_value: "", high_value: "" };
        
        if (test_id != null) {
          const { data: testInfo, error: testInfoErr } = await supabase
            .from("test_information")
            .select("description, name")
            .eq("id", test_id)
            .maybeSingle();

          if (testInfo) {
            if (testInfo.name) {
              test_name = testInfo.name;
            }
            genderValues = getGenderBasedValues(testInfo, selectedReport?.gender);
          }

          const existingResult = existingResultsMap.get(test_id);
          
          loadedTestsMap[compositeKey] = {
            test_id,
            test_name,
            category,
            measuring_unit: genderValues.measuring_unit,
            low_value: genderValues.low_value,
            high_value: genderValues.high_value,
            user_value: existingResult?.user_value || "",
          };
        }
      }

      const testsWithHeaders: LoadedTestResult[] = [];
      const testsArray = Object.values(loadedTestsMap);
      const grouped: Record<string, LoadedTestResult[]> = {};

      for (const test of testsArray) {
        const cat = test.category || "Uncategorized";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(test);
      }

      Object.entries(grouped).forEach(([categoryName, testsList]) => {
        testsWithHeaders.push({
          test_id: -1,
          test_name: categoryName,
          category: categoryName,
          measuring_unit: "",
          low_value: "",
          high_value: "",
          user_value: "",
          is_category_header: true,
        });
        testsList.forEach(test => testsWithHeaders.push(test));
      });

      setLoadedTestResults(testsWithHeaders);
    } catch (error: any) {
      console.error("Error loading tests from invoice items:", error);
      setLoadedTestResults([]);
      toast.error("Failed to load test details from invoice");
    }
  };

  const handleReportSelect = async (report: PreReport) => {
    setSelectedReport(report);

    if (report.document_no) {
      await loadTestsFromInvoiceItems(report.document_no);
    } else {
      setLoadedTestResults([]);
    }

    setIsSearchModalOpen(false);
    toast.success(`Report for ${report.patient_name} loaded successfully`);
  };

  const handleValueChange = (testId: number, value: string) => {
    setLoadedTestResults((prev) =>
      prev.map((test) =>
        test.test_id === testId ? { ...test, user_value: value } : test
      )
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB");
  };

  const handleSaveReportResults = async () => {
    if (!selectedReport?.document_no || loadedTestResults.length === 0) {
      toast.error("No report or test results to save");
      return;
    }
    setSaving(true);
    toast.loading("Saving report...");
    try {
      const rowsToSave = loadedTestResults
        .filter(r => !r.is_category_header)
        .map(r => ({
          document_no: selectedReport.document_no,
          test_id: r.test_id,
          test_name: r.test_name,
          category: r.category,
          measuring_unit: r.measuring_unit,
          low_value: r.low_value,
          high_value: r.high_value,
          user_value: r.user_value,
        }));

      const { data, error } = await supabase
        .from("test_report_results")
        .upsert(rowsToSave, { onConflict: "document_no,test_id" });
      
      if (error) throw error;
      toast.success("Test results saved successfully!");
    } catch (err) {
      toast.error("Failed to save test results");
      console.error(err);
    } finally {
      setSaving(false);
      toast.dismiss();
    }
  };

  useImperativeHandle(ref, () => ({
    clearForm: () => {
      setSelectedReport(null);
      setLoadedTestResults([]);
      setTestResults([]);
      setSearchTerm("");
      setIsAddMode(false);
    }
  }));

  useEffect(() => {
    if (isDeleting && !isSearchModalOpen) {
      setIsSearchModalOpen(true);
    }
  }, [isDeleting]);

  useEffect(() => {
    if (isEditable && !selectedReport && !isSearchModalOpen && !isAddMode) {
      setIsSearchModalOpen(true);
    }
  }, [isEditable, selectedReport, isSearchModalOpen, isAddMode]);

  useEffect(() => {
    if (isEditable && !selectedReport) {
      setIsAddMode(true);
    }
  }, [isEditable, selectedReport]);

  function handleSearchClick() {
    setIsSearchModalOpen(true);
    if (reports.length === 0) {
      fetchReports();
    }
  }

  const handleDeleteReportResult = async () => {
    if (!selectedReport?.document_no) {
      toast.error("Select a report to delete.");
      return;
    }
    if (!confirm("Are you sure you want to delete all test results for this document?")) return;

    try {
      const { error } = await supabase
        .from("test_report_results")
        .delete()
        .eq("document_no", selectedReport.document_no);

      if (error) throw error;

      toast.success("Deleted test results for this document!");
      setSelectedReport(null);
      setLoadedTestResults([]);
    } catch (error) {
      toast.error("Failed to delete test results");
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md space-y-6">
      <div className="border-b pb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Test Result</h2>
        {isDeleting && selectedReport?.document_no && (
          <Button variant="destructive" onClick={handleDeleteReportResult}>
            Delete Report Results
          </Button>
        )}
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="documentNo" className="text-sm font-medium">
              Document No:
            </Label>
            <div className="flex gap-2">
              <Input
                id="documentNo"
                value={selectedReport?.document_no || ""}
                readOnly={!isAddMode}
                disabled={!isAddMode}
                className={isAddMode ? "bg-white" : "bg-gray-50"}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearchClick}
                className="px-3"
                disabled={isAddMode}
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
                test.is_category_header ? (
                  <TableRow 
                    key={`head-${test.category}-${index}`} 
                    className="bg-blue-500 text-white"
                  >
                    <TableCell colSpan={6} className="font-bold text-lg text-center py-2 uppercase tracking-wider">
                      {test.test_name}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={`${test.test_id}-${index}`}>
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
                        readOnly={!isEditable}
                        disabled={!isEditable}
                      />
                    </TableCell>
                  </TableRow>
                )
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

      {isEditable && selectedReport?.document_no && loadedTestResults.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleSaveReportResults}
            disabled={saving}
            className="px-6"
          >
            {saving ? "Saving..." : "Save Report"}
          </Button>
        </div>
      )}

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

});

export default ReportDataEntryForm;
