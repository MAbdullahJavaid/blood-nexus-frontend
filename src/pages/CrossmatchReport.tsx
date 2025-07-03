import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CrossmatchReportFilter from "@/components/reports/CrossmatchReportFilter";
import CrossmatchReportDisplay from "@/components/reports/CrossmatchReportDisplay";
import PatientRequestReportActions from "@/components/reports/PatientRequestReportActions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CrossmatchData {
  crossmatch_no: string;
  patient_name: string;
  age: number;
  blood_group: string;
  rh: string;
  hospital: string;
  date: string;
  quantity: number;
  albumin: string;
  saline: string;
  coomb: string;
  result: string;
  remarks: string;
  expiry_date: string;
  donor_name?: string;
  donor_age?: number;
  donor_blood_group?: string;
  donor_rh?: string;
  bag_id?: string;
  bleeding_date?: string;
  hbsag?: number;
  hcv?: number;
  hiv?: number;
  vdrl?: number;
  hb?: number;
}

const CrossmatchReport = () => {
  const [showFilter, setShowFilter] = useState(true);
  const [reportData, setReportData] = useState<CrossmatchData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCrossmatchData = async (from: string, to: string) => {
    setLoading(true);
    try {
      // First, get crossmatch records in the range
      const { data: crossmatchRecords, error: crossmatchError } = await supabase
        .from('crossmatch_records')
        .select('*')
        .gte('crossmatch_no', from || '0')
        .lte('crossmatch_no', to || 'ZZZZ')
        .order('crossmatch_no');

      if (crossmatchError) {
        console.error("Error fetching crossmatch records:", crossmatchError);
        toast.error("Failed to fetch crossmatch records");
        return;
      }

      if (!crossmatchRecords || crossmatchRecords.length === 0) {
        toast.error("No crossmatch records found in the specified range");
        return;
      }

      // For each crossmatch record, get the related donor and bleeding data
      const enrichedData: CrossmatchData[] = [];

      for (const record of crossmatchRecords) {
        const enrichedRecord: CrossmatchData = {
          crossmatch_no: record.crossmatch_no,
          patient_name: record.patient_name,
          age: record.age || 0,
          blood_group: record.blood_group || '',
          rh: record.rh || '',
          hospital: record.hospital || '',
          date: record.date,
          quantity: record.quantity,
          albumin: record.albumin,
          saline: record.saline,
          coomb: record.coomb,
          result: record.result,
          remarks: record.remarks || '',
          expiry_date: record.expiry_date || '',
        };

        // Try to get bleeding record data if product_id matches bag_id
        if (record.product_id) {
          const { data: bleedingRecord } = await supabase
            .from('bleeding_records')
            .select(`
              *,
              donors:donor_id (
                name,
                blood_group_separate,
                rh_factor,
                date_of_birth
              )
            `)
            .eq('bag_id', record.product_id)
            .single();

          if (bleedingRecord) {
            enrichedRecord.bag_id = bleedingRecord.bag_id;
            enrichedRecord.bleeding_date = bleedingRecord.bleeding_date;
            enrichedRecord.hbsag = bleedingRecord.hbsag;
            enrichedRecord.hcv = bleedingRecord.hcv;
            enrichedRecord.hiv = bleedingRecord.hiv;
            enrichedRecord.vdrl = bleedingRecord.vdrl;
            enrichedRecord.hb = bleedingRecord.hb;

            if (bleedingRecord.donors) {
              const donor = Array.isArray(bleedingRecord.donors) 
                ? bleedingRecord.donors[0] 
                : bleedingRecord.donors;
              
              enrichedRecord.donor_name = donor.name;
              enrichedRecord.donor_blood_group = donor.blood_group_separate;
              enrichedRecord.donor_rh = donor.rh_factor;
              
              if (donor.date_of_birth) {
                const birthDate = new Date(donor.date_of_birth);
                const today = new Date();
                enrichedRecord.donor_age = today.getFullYear() - birthDate.getFullYear();
              }
            }
          }
        }

        enrichedData.push(enrichedRecord);
      }

      setReportData(enrichedData);
      setShowFilter(false);
      toast.success(`Found ${enrichedData.length} crossmatch record(s)`);

    } catch (error) {
      console.error("Error fetching crossmatch data:", error);
      toast.error("Failed to fetch crossmatch data");
    } finally {
      setLoading(false);
    }
  };

  const handleOk = (from: string, to: string) => {
    console.log("Filter applied:", { from, to });
    fetchCrossmatchData(from, to);
  };

  const handleCancel = () => {
    setShowFilter(false);
    setReportData([]);
  };

  const handleBack = () => {
    setShowFilter(true);
    setReportData([]);
  };

  const handleExportPDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Get all crossmatch report pages
      const reportPages = document.querySelectorAll('.crossmatch-report-page');
      
      for (let i = 0; i < reportPages.length; i++) {
        const pageElement = reportPages[i] as HTMLElement;
        
        if (i > 0) {
          pdf.addPage(); // Add new page for each crossmatch record except the first
        }

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          height: pageElement.scrollHeight,
          width: pageElement.scrollWidth
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If image is taller than page, we need to split it
        if (imgHeight <= pageHeight) {
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
          // Handle case where single page content is too tall
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        }
      }

      pdf.save('crossmatch-report.pdf');
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const handleExportJPEG = async () => {
    try {
      const reportPages = document.querySelectorAll('.crossmatch-report-page');
      
      for (let i = 0; i < reportPages.length; i++) {
        const pageElement = reportPages[i] as HTMLElement;
        
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });

        const link = document.createElement('a');
        link.download = `crossmatch-report-${i + 1}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
      }
      
      toast.success("JPEG files exported successfully");
    } catch (error) {
      console.error("Error exporting JPEG:", error);
      toast.error("Failed to export JPEG");
    }
  };

  const handleExit = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crossmatch data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showFilter ? (
        <CrossmatchReportFilter 
          onOk={handleOk} 
          onCancel={handleCancel}
          onExportPDF={handleExportPDF}
          onExportJPEG={handleExportJPEG}
          onExit={handleExit}
          isExportDisabled={reportData.length === 0}
        />
      ) : reportData.length > 0 ? (
        <div>
          <PatientRequestReportActions
            onExportPDF={handleExportPDF}
            onExportJPEG={handleExportJPEG}
            onExit={handleBack}
            isExportDisabled={false}
          />
          <div id="crossmatch-report">
            <CrossmatchReportDisplay data={reportData} />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 text-lg">
          <p className="mb-4">No crossmatch records found.</p>
          <button 
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default CrossmatchReport;
