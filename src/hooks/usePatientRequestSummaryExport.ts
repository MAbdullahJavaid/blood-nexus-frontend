
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportData {
  document_no: string;
  document_date: string;
  patient_id: string | null;
  patient_name: string;
  total_amount: number;
  discount_amount: number;
  net_amount: number;
}

export function usePatientRequestSummaryExport() {
  const exportToPDF = async (data: ExportData[], elementId: string) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        toast.error("Report element not found");
        return;
      }

      toast.info("Generating PDF...");
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const fileName = `patient-request-summary-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const exportToJPG = async (elementId: string) => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        toast.error("Report element not found");
        return;
      }

      toast.info("Generating JPG...");
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `patient-request-summary-${new Date().toISOString().split('T')[0]}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      
      toast.success("JPG exported successfully");
    } catch (error) {
      console.error("Error exporting JPG:", error);
      toast.error("Failed to export JPG");
    }
  };

  return {
    exportToPDF,
    exportToJPG,
  };
}
