
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

interface TestPositiveReportData {
  id: string;
  bag_id: string;
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
    date_of_birth?: string;
    gender?: string;
  };
}

interface TestPositiveReportTableProps {
  data: TestPositiveReportData[];
  isLoading: boolean;
}

const TestPositiveReportTable = ({ data, isLoading }: TestPositiveReportTableProps) => {
  
  useEffect(() => {
    const handleExport = async (event: CustomEvent) => {
      const { format } = event.detail;
      
      try {
        const tableElement = document.getElementById('test-positive-report-table');
        if (!tableElement) return;

        if (format === 'pdf') {
          const canvas = await html2canvas(tableElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4');
          const imgWidth = 297;
          const pageHeight = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
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

          pdf.save('test-positive-report.pdf');
        } else if (format === 'jpeg') {
          const canvas = await html2canvas(tableElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true
          });
          
          const link = document.createElement('a');
          link.download = 'test-positive-report.jpg';
          link.href = canvas.toDataURL('image/jpeg', 0.9);
          link.click();
        }

        toast({
          title: "Export Successful",
          description: `Test Positive Report exported as ${format.toUpperCase()}`,
        });
      } catch (error) {
        console.error('Export error:', error);
        toast({
          title: "Export Failed",
          description: "Failed to export the report. Please try again.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('exportTestPositive', handleExport as EventListener);
    return () => window.removeEventListener('exportTestPositive', handleExport as EventListener);
  }, []);

  const calculateAge = (dateOfBirth: string | undefined): number => {
    if (!dateOfBirth) return 0;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatValue = (value: number | undefined): string => {
    return value !== undefined && value !== null ? value.toString() : '';
  };

  const isPositive = (value: number | undefined): boolean => {
    return value !== undefined && value !== null && value > 1.0;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getDonorType = (): string => {
    return ""; // Empty as shown in the format
  };

  const getBagType = (): string => {
    return "Double Bag"; // Default as shown in format
  };

  // Calculate totals for positive results
  const totals = data.reduce((acc, record) => {
    if (isPositive(record.vdrl)) acc.vdrl++;
    if (isPositive(record.hbsag)) acc.hbsag++;
    if (isPositive(record.hiv)) acc.hiv++;
    if (isPositive(record.hcv)) acc.hcv++;
    return acc;
  }, { vdrl: 0, hbsag: 0, hiv: 0, hcv: 0 });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading test positive report...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-lg font-bold">
          SUNDAS FOUNDATION<br />
          Test Positive Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id="test-positive-report-table" className="overflow-x-auto">
          <Table className="border border-gray-300">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-300">
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">Bag No</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">Name</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">Date</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">Age</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">Sex</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">Phone No</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">Donor Type</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">Bag Type</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black bg-red-50">Screening Results</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black">HB</TableHead>
              </TableRow>
              <TableRow className="bg-gray-50 border-b border-gray-300">
                <TableHead className="border-r border-gray-300"></TableHead>
                <TableHead className="border-r border-gray-300"></TableHead>
                <TableHead className="border-r border-gray-300"></TableHead>
                <TableHead className="border-r border-gray-300"></TableHead>
                <TableHead className="border-r border-gray-300"></TableHead>
                <TableHead className="border-r border-gray-300"></TableHead>
                <TableHead className="border-r border-gray-300"></TableHead>
                <TableHead className="border-r border-gray-300"></TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black text-xs">V.D.R.L</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black text-xs">HBsAg</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black text-xs">Anti HCV</TableHead>
                <TableHead className="border-r border-gray-300 text-center font-bold text-black text-xs">Anti HIV</TableHead>
                <TableHead className="border-r border-gray-300"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <TableRow key={record.id} className="border-b border-gray-300">
                  <TableCell className="border-r border-gray-300 text-center">{record.bag_id}</TableCell>
                  <TableCell className="border-r border-gray-300 text-center">{record.donors.name}</TableCell>
                  <TableCell className="border-r border-gray-300 text-center">{formatDate(record.bleeding_date)}</TableCell>
                  <TableCell className="border-r border-gray-300 text-center">{calculateAge(record.donors.date_of_birth)}</TableCell>
                  <TableCell className="border-r border-gray-300 text-center">{record.donors.gender || 'Male'}</TableCell>
                  <TableCell className="border-r border-gray-300 text-center">{record.donors.phone || ''}</TableCell>
                  <TableCell className="border-r border-gray-300 text-center">{getDonorType()}</TableCell>
                  <TableCell className="border-r border-gray-300 text-center">{getBagType()}</TableCell>
                  <TableCell 
                    className={`border-r border-gray-300 text-center ${isPositive(record.vdrl) ? 'text-red-600 font-bold' : ''}`}
                  >
                    {formatValue(record.vdrl)}
                  </TableCell>
                  <TableCell 
                    className={`border-r border-gray-300 text-center ${isPositive(record.hbsag) ? 'text-red-600 font-bold' : ''}`}
                  >
                    {formatValue(record.hbsag)}
                  </TableCell>
                  <TableCell 
                    className={`border-r border-gray-300 text-center ${isPositive(record.hcv) ? 'text-red-600 font-bold' : ''}`}
                  >
                    {formatValue(record.hcv)}
                  </TableCell>
                  <TableCell 
                    className={`border-r border-gray-300 text-center ${isPositive(record.hiv) ? 'text-red-600 font-bold' : ''}`}
                  >
                    {formatValue(record.hiv)}
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-center">{formatValue(record.hb)}</TableCell>
                </TableRow>
              ))}
              
              {/* Grand Total Row */}
              <TableRow className="bg-gray-100 border-b-2 border-gray-400 font-bold">
                <TableCell className="border-r border-gray-300 text-center" colSpan={8}>Grand Total:</TableCell>
                <TableCell className="border-r border-gray-300 text-center text-red-600">{totals.vdrl}</TableCell>
                <TableCell className="border-r border-gray-300 text-center text-red-600">{totals.hbsag}</TableCell>
                <TableCell className="border-r border-gray-300 text-center text-red-600">{totals.hcv}</TableCell>
                <TableCell className="border-r border-gray-300 text-center text-red-600">{totals.hiv}</TableCell>
                <TableCell className="border-r border-gray-300 text-center">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          {data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No positive test results found for the selected date range.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestPositiveReportTable;
