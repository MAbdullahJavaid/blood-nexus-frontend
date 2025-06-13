
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface BleedingRecord {
  id: string;
  donor_id: string;
  bleeding_date: string;
  bag_id: string;
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
  data: BleedingRecord[];
  isLoading: boolean;
}

const TestPositiveReportTable = ({ data, isLoading }: TestPositiveReportTableProps) => {
  
  useEffect(() => {
    const handleExport = (event: CustomEvent) => {
      const { format: exportFormat } = event.detail;
      if (exportFormat === 'pdf') {
        exportToPDF();
      } else if (exportFormat === 'jpeg') {
        exportToJPEG();
      }
    };

    window.addEventListener('exportTestPositive', handleExport as EventListener);
    return () => {
      window.removeEventListener('exportTestPositive', handleExport as EventListener);
    };
  }, [data]);

  const calculateAge = (dateOfBirth?: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const isPositiveResult = (value?: number): boolean => {
    return value !== undefined && value !== null && value > 1.0;
  };

  const formatTestValue = (value?: number): string => {
    if (value === undefined || value === null) return '-';
    return value.toFixed(2);
  };

  const getTestCellClass = (value?: number): string => {
    return isPositiveResult(value) ? 'text-red-600 font-semibold' : '';
  };

  const getBagType = (record: BleedingRecord): string => {
    // This could be enhanced based on your business logic
    return 'Double Bag';
  };

  const getDonorType = (record: BleedingRecord): string => {
    // This could be enhanced based on your business logic
    return '';
  };

  // Calculate grand totals for positive results
  const grandTotals = {
    vdrl: data.filter(record => isPositiveResult(record.vdrl)).length,
    hbsag: data.filter(record => isPositiveResult(record.hbsag)).length,
    hcv: data.filter(record => isPositiveResult(record.hcv)).length,
    hiv: data.filter(record => isPositiveResult(record.hiv)).length,
  };

  const exportToPDF = async () => {
    const element = document.getElementById('test-positive-report-table');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Test_Positive_Report_${format(new Date(), 'dd-MM-yyyy')}.pdf`);
  };

  const exportToJPEG = async () => {
    const element = document.getElementById('test-positive-report-table');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const link = document.createElement('a');
    link.download = `Test_Positive_Report_${format(new Date(), 'dd-MM-yyyy')}.jpeg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading test positive report...</div>
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
            <p>No positive test results found for the selected criteria.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Test Positive Report
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div id="test-positive-report-table" className="bg-white p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold mb-2">SUNDAS FOUNDATION</h1>
            <h2 className="text-lg font-semibold">Test Positive Report</h2>
          </div>

          {/* Table */}
          <div className="border border-black">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="border-b border-black">
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Bag No</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Name</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Date</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Age</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Sex</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Phone No</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Donor Type</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Bag Type</TableHead>
                  <TableHead colSpan={4} className="text-center font-bold text-black border-b border-black p-2">
                    Screening Results
                  </TableHead>
                  <TableHead className="border-l border-black p-2 text-center font-bold text-black">HB</TableHead>
                </TableRow>
                <TableRow className="border-b border-black">
                  <TableHead colSpan={8} className="p-0 border-r border-black"></TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">V.D.R.L</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">HBsAg</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Anti HCV</TableHead>
                  <TableHead className="border-r border-black p-2 text-center font-bold text-black">Anti HIV</TableHead>
                  <TableHead className="p-2 text-center font-bold text-black">HB</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((record, index) => (
                  <TableRow key={record.id} className="border-b border-black">
                    <TableCell className="border-r border-black p-2 text-center">{record.bag_id}</TableCell>
                    <TableCell className="border-r border-black p-2">{record.donors.name}</TableCell>
                    <TableCell className="border-r border-black p-2 text-center">
                      {format(new Date(record.bleeding_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="border-r border-black p-2 text-center">
                      {calculateAge(record.donors.date_of_birth)}
                    </TableCell>
                    <TableCell className="border-r border-black p-2 text-center">
                      {record.donors.gender || 'Male'}
                    </TableCell>
                    <TableCell className="border-r border-black p-2 text-center">
                      {record.donors.phone || ''}
                    </TableCell>
                    <TableCell className="border-r border-black p-2 text-center">
                      {getDonorType(record)}
                    </TableCell>
                    <TableCell className="border-r border-black p-2 text-center">
                      {getBagType(record)}
                    </TableCell>
                    <TableCell className={`border-r border-black p-2 text-center ${getTestCellClass(record.vdrl)}`}>
                      {formatTestValue(record.vdrl)}
                    </TableCell>
                    <TableCell className={`border-r border-black p-2 text-center ${getTestCellClass(record.hbsag)}`}>
                      {formatTestValue(record.hbsag)}
                    </TableCell>
                    <TableCell className={`border-r border-black p-2 text-center ${getTestCellClass(record.hcv)}`}>
                      {formatTestValue(record.hcv)}
                    </TableCell>
                    <TableCell className={`border-r border-black p-2 text-center ${getTestCellClass(record.hiv)}`}>
                      {formatTestValue(record.hiv)}
                    </TableCell>
                    <TableCell className="p-2 text-center">
                      {record.hb ? `${record.hb}` : ''}
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Grand Total Row */}
                <TableRow className="border-b-2 border-black bg-gray-50">
                  <TableCell colSpan={8} className="border-r border-black p-2 text-center font-bold">
                    Grand Total:
                  </TableCell>
                  <TableCell className="border-r border-black p-2 text-center font-bold text-red-600">
                    {grandTotals.vdrl}
                  </TableCell>
                  <TableCell className="border-r border-black p-2 text-center font-bold text-red-600">
                    {grandTotals.hbsag}
                  </TableCell>
                  <TableCell className="border-r border-black p-2 text-center font-bold text-red-600">
                    {grandTotals.hcv}
                  </TableCell>
                  <TableCell className="border-r border-black p-2 text-center font-bold text-red-600">
                    {grandTotals.hiv}
                  </TableCell>
                  <TableCell className="p-2 text-center font-bold">
                    0
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestPositiveReportTable;
