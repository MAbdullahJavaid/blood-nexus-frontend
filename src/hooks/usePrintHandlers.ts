
import { useState } from "react";
import { ReportType } from "@/components/reports/PrintReportModal";
import { transformFormDataToReport, getReportTypeFromForm } from "@/utils/FormDataTransformers";
import { toast } from "sonner";

export function usePrintHandlers() {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('crossmatch');
  const [reportData, setReportData] = useState<any>(null);

  const handlePrintForm = (formType: string, formData: any) => {
    console.log("Print requested for form:", formType, formData);
    
    if (!formData || Object.keys(formData).length === 0) {
      toast.error("No data available to print. Please fill the form first.");
      return;
    }

    try {
      const transformedData = transformFormDataToReport(formType, formData);
      const reportTypeForData = getReportTypeFromForm(formType);
      
      setReportType(reportTypeForData);
      setReportData(transformedData);
      setIsPrintModalOpen(true);
      
      console.log("Print modal opened with data:", transformedData);
    } catch (error) {
      console.error("Error preparing print data:", error);
      toast.error("Failed to prepare print data");
    }
  };

  const handlePrintComplete = () => {
    console.log("Print completed");
    setIsPrintModalOpen(false);
    toast.success("Print dialog opened successfully");
  };

  return {
    isPrintModalOpen,
    setIsPrintModalOpen,
    reportType,
    reportData,
    handlePrintForm,
    handlePrintComplete,
  };
}
