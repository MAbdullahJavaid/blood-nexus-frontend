
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface BleedingRecord {
  id: string;
  donor_id: string;
  bleeding_date: string;
  hbsag?: number;
  hcv?: number;
  hiv?: number;
  vdrl?: number;
  hb?: number;
  donors: {
    id: string;
    donor_id: string;
    name: string;
    phone?: string;
    address?: string;
    blood_group_separate?: string;
    rh_factor?: string;
    date_of_birth?: string;
    gender?: string;
  };
}

interface DonorScreeningReportTableProps {
  data: BleedingRecord[];
  isLoading: boolean;
}

const DonorScreeningReportTable = ({ data, isLoading }: DonorScreeningReportTableProps) => {
  
  useEffect(() => {
    const handleExport = (event: CustomEvent) => {
      const { format: exportFormat } = event.detail;
      if (exportFormat === 'pdf') {
        exportToPDF();
      } else if (exportFormat === 'jpeg') {
        exportToJPEG();
      }
    };

    window.addEventListener('exportDonorScreening', handleExport as EventListener);
    return () => {
      window.removeEventListener('exportDonorScreening', handleExport as EventListener);
    };
  }, [data]);

  const getTestResult = (value?: number, cutOff: number = 1.0): string => {
    if (value === undefined || value === null) return 'Not Tested';
    return value < cutOff ? 'Non-Reactive' : 'Reactive';
  };

  const calculateAge = (dateOfBirth?: string): string => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return `${age - 1} Year(s)`;
    }
    return `${age} Year(s)`;
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    
    for (let i = 0; i < data.length; i++) {
      if (i > 0) pdf.addPage();
      
      const element = document.getElementById(`screening-report-${i}`);
      if (!element) continue;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
    }
    
    pdf.save(`Donor_Screening_Report_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
  };

  const exportToJPEG = async () => {
    for (let i = 0; i < data.length; i++) {
      const element = document.getElementById(`screening-report-${i}`);
      if (!element) continue;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `Donor_Screening_${data[i].donors.donor_id}_${format(new Date(), 'dd-MM-yyyy')}.jpeg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading donor screening reports...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No screening data found for the selected criteria.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((record, index) => (
        <Card key={record.id} className="break-after-page">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Donor Screening Report - {record.donors.name}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <div id={`screening-report-${index}`} className="bg-white p-8" style={{ minHeight: '297mm', width: '210mm' }}>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="border-t-4 border-b-4 border-red-600 py-4">
                  <h1 className="text-xl font-bold mb-2">BLOOD CARE FOUNDATION</h1>
                  <h2 className="text-lg font-semibold">BLOOD TRANSFUSION AND HEMATOLOGICAL SERVICES</h2>
                  <div className="text-sm mt-2">We Care About..... THALASSAEMIC, HAEMOPHILIC, BLOOD CANCER PATIENTS!</div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="space-y-2">
                  <div><strong>REG NO:</strong> {record.donors.donor_id}</div>
                  <div><strong>Donor Name:</strong> {record.donors.name}</div>
                  <div><strong>Address:</strong> {record.donors.address || 'N/A'}</div>
                  <div><strong>Age:</strong> {calculateAge(record.donors.date_of_birth)}/{record.donors.gender || 'N/A'}</div>
                </div>
                <div className="space-y-2">
                  <div><strong>Document Date:</strong> {format(new Date(record.bleeding_date), 'dd-MMM-yyyy')}</div>
                  <div><strong>Contact:</strong> {record.donors.phone || 'N/A'}</div>
                  <div><strong>Blood Group:</strong> {record.donors.blood_group_separate || ''} {record.donors.rh_factor || ''}</div>
                </div>
              </div>

              {/* Screening Report Table */}
              <div className="border-2 border-black mb-8">
                <h3 className="text-center text-lg font-bold bg-gray-100 py-2 border-b-2 border-black">
                  SCREENING REPORT
                </h3>
                
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="border-r border-black p-3 text-left font-bold">Test</th>
                      <th className="border-r border-black p-3 text-center font-bold">Donor/Patient Value</th>
                      <th className="border-r border-black p-3 text-center font-bold">Cut Off Value</th>
                      <th className="p-3 text-center font-bold">RESULT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="border-r border-black p-3">HBsAg (Hepatitis B)</td>
                      <td className="border-r border-black p-3 text-center">{record.hbsag?.toFixed(2) || 'N/A'}</td>
                      <td className="border-r border-black p-3 text-center">1.00</td>
                      <td className="p-3 text-center font-semibold">{getTestResult(record.hbsag)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="border-r border-black p-3">Anti - HCV (Hepatitis C)</td>
                      <td className="border-r border-black p-3 text-center">{record.hcv?.toFixed(2) || 'N/A'}</td>
                      <td className="border-r border-black p-3 text-center">1.00</td>
                      <td className="p-3 text-center font-semibold">{getTestResult(record.hcv)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="border-r border-black p-3">Anti - HIV</td>
                      <td className="border-r border-black p-3 text-center">{record.hiv?.toFixed(2) || 'N/A'}</td>
                      <td className="border-r border-black p-3 text-center">1.00</td>
                      <td className="p-3 text-center font-semibold">{getTestResult(record.hiv)}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="border-r border-black p-3">V.D.R.L (Syphilis)</td>
                      <td className="border-r border-black p-3 text-center">{record.vdrl?.toFixed(2) || 'N/A'}</td>
                      <td className="border-r border-black p-3 text-center">1.00</td>
                      <td className="p-3 text-center font-semibold">{getTestResult(record.vdrl)}</td>
                    </tr>
                    <tr>
                      <td className="border-r border-black p-3">HB</td>
                      <td className="border-r border-black p-3 text-center">{record.hb ? `${record.hb} g/dL` : 'N/A'}</td>
                      <td className="border-r border-black p-3 text-center">-</td>
                      <td className="p-3 text-center font-semibold">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <h4 className="font-bold mb-4">NOTE:-</h4>
                <ul className="space-y-2 text-sm">
                  <li>• These test are performed by CMIA,(CHEMILUMINESCENT MICROPARTICAL IMMUNOASSAY) ELISA (Enzyme Linked Immunosorbent Assay) Technique.</li>
                  <li>• In case of any doubt regarding this report, please contact BLOOD CARE FOUNDATION within 10 Days.</li>
                  <li>• This report is valid for 90 Days.</li>
                  <li>• This report is not valid for court.</li>
                </ul>
              </div>

              {/* Signature */}
              <div className="text-right mt-16">
                <div className="inline-block">
                  <div className="mb-16"></div>
                  <div className="text-center font-semibold">Senior Medical Technologist</div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-red-600 pt-4 mt-8 text-center text-sm">
                <div className="font-semibold">St. No. 5, Allama Iqbal Colony, Jinnah Road, Dhulley, Gujranwala.</div>
                <div>Tel: 055-3856541, 3840694 Email: admin@bloodcarefoundation.org</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DonorScreeningReportTable;
