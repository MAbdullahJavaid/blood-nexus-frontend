
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

// Refactored hooks & components
import useReportLoader, { PreReport, LoadedTestResult } from "./ReportDataEntryForm/useReportLoader";
import PatientInfoSection from "./ReportDataEntryForm/PatientInfoSection";
import TestResultsTable from "./ReportDataEntryForm/TestResultsTable";
import SearchModal from "./ReportDataEntryForm/SearchModal";

interface ReportDataEntryFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

const ReportDataEntryForm = ({
  isSearchEnabled = true,
  isEditable = false,
}: ReportDataEntryFormProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<PreReport | null>(null);
  const [loadedTestResults, setLoadedTestResults] = useState<LoadedTestResult[]>([]);

  const { reports, loading, fetchReports, loadTestsFromInvoiceItems } = useReportLoader();

  const filteredReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          report.document_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [reports, searchTerm]
  );

  const handleReportSelect = async (report: PreReport) => {
    setSelectedReport(report);
    if (report.document_no) {
      const tests = await loadTestsFromInvoiceItems(report.document_no);
      setLoadedTestResults(tests);
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

  function handleSearchClick() {
    setIsSearchModalOpen(true);
    if (reports.length === 0) {
      fetchReports();
    }
  }

  return (
    <div className="bg-white p-6 rounded-md space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Test Result</h2>
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

      {/* Patient Information Section (Refactored) */}
      <div>
        <div className="flex gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSearchClick}
            className="px-3"
            disabled={!isSearchEnabled}
            type="button"
          >
            <Search className="h-4 w-4" />
          </Button>
          <span className="text-gray-700 text-sm">
            {selectedReport?.document_no ? `Doc # ${selectedReport.document_no}` : "Select/Find document to view report"}
          </span>
        </div>
        <PatientInfoSection
          selectedReport={selectedReport}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
        />
      </div>

      {/* Test Results Table */}
      <TestResultsTable
        loadedTestResults={loadedTestResults}
        isEditable={isEditable}
        onValueChange={handleValueChange}
      />

      {/* Search Modal */}
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredReports={filteredReports}
        loading={loading}
        onReportSelect={handleReportSelect}
        formatDate={formatDate}
      />
    </div>
  );
};

export default ReportDataEntryForm;
