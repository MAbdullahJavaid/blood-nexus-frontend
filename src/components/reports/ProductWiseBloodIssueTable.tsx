
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ProductWiseBloodIssueTableProps {
  category?: string;
  fromDate?: string;
  toDate?: string;
}

interface BloodCategoryData {
  date: string;
  WB: number;
  PC: number;
  FFP: number;
  PLT: number;
  CP: number;
  total: number;
}

const ProductWiseBloodIssueTable = ({ category, fromDate, toDate }: ProductWiseBloodIssueTableProps) => {
  const [data, setData] = useState<BloodCategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    WB: 0,
    PC: 0,
    FFP: 0,
    PLT: 0,
    CP: 0,
    total: 0
  });

  useEffect(() => {
    if (fromDate && toDate) {
      fetchProductWiseData();
    }
  }, [category, fromDate, toDate]);

  const fetchProductWiseData = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    console.log("Fetching product wise blood issue data for date range:", fromDate, "to", toDate);

    try {
      let query = supabase
        .from('patient_invoices')
        .select(`
          document_date,
          blood_category,
          bottle_quantity
        `)
        .gte('document_date', fromDate.split('T')[0])
        .lte('document_date', toDate.split('T')[0])
        .not('blood_category', 'is', null);

      // Apply category filter if specified
      if (category && category !== "All") {
        query = query.eq('blood_category', category);
      }

      const { data: invoiceData, error } = await query;

      if (error) {
        console.error("Error fetching invoice data:", error);
        return;
      }

      console.log("Invoice data:", invoiceData);

      // Group data by date and blood category
      const groupedData: { [key: string]: BloodCategoryData } = {};

      invoiceData?.forEach((record) => {
        const dateKey = format(new Date(record.document_date), 'dd/MM/yyyy');
        
        if (!groupedData[dateKey]) {
          groupedData[dateKey] = {
            date: dateKey,
            WB: 0,
            PC: 0,
            FFP: 0,
            PLT: 0,
            CP: 0,
            total: 0
          };
        }

        const quantity = record.bottle_quantity || 1;
        const bloodCategory = record.blood_category?.toUpperCase();

        switch (bloodCategory) {
          case 'WB':
            groupedData[dateKey].WB += quantity;
            break;
          case 'PC':
            groupedData[dateKey].PC += quantity;
            break;
          case 'FFP':
            groupedData[dateKey].FFP += quantity;
            break;
          case 'PLT':
            groupedData[dateKey].PLT += quantity;
            break;
          case 'CP':
            groupedData[dateKey].CP += quantity;
            break;
          default:
            // Handle other categories as needed
            break;
        }

        groupedData[dateKey].total += quantity;
      });

      // Convert to array and sort by date
      const resultArray = Object.values(groupedData).sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });

      // Calculate totals
      const newTotals = {
        WB: 0,
        PC: 0,
        FFP: 0,
        PLT: 0,
        CP: 0,
        total: 0
      };

      resultArray.forEach((row) => {
        newTotals.WB += row.WB;
        newTotals.PC += row.PC;
        newTotals.FFP += row.FFP;
        newTotals.PLT += row.PLT;
        newTotals.CP += row.CP;
        newTotals.total += row.total;
      });

      setData(resultArray);
      setTotals(newTotals);
    } catch (error) {
      console.error("Error in fetchProductWiseData:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('product-wise-report');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
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

      pdf.save(`product_wise_blood_issue_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleExportJPEG = async () => {
    const element = document.getElementById('product-wise-report');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `product_wise_blood_issue_${format(new Date(), 'yyyy-MM-dd')}.jpeg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    } catch (error) {
      console.error('Error generating JPEG:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Fetching product wise blood issue data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <p className="text-xs mb-1">AFFILIATED WITH</p>
            <p className="text-sm font-bold mb-2">We Care About.....</p>
            <p className="text-sm font-bold mb-1">THALASSAEMIC, HAEMOPHILIC, BLOOD CANCER PATIENTS!</p>
            <h1 className="text-xl font-bold mb-1">BLOOD CARE FOUNDATION</h1>
            <p className="text-sm font-medium mb-2">BLOOD TRANSFUSION AND HEMATOLOGICAL SERVICE</p>
            <div className="w-full h-1 bg-red-600 mb-4"></div>
            <h2 className="text-lg font-bold">Blood Issuing Blood Category Wise</h2>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleExportPDF} className="flex items-center gap-2" size="sm">
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button onClick={handleExportJPEG} className="flex items-center gap-2" size="sm" variant="outline">
              <Download className="h-4 w-4" />
              JPEG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div id="product-wise-report" className="bg-white p-4">
          <div className="text-center mb-6">
            <p className="text-xs mb-1">AFFILIATED WITH</p>
            <p className="text-sm font-bold mb-2">We Care About.....</p>
            <p className="text-sm font-bold mb-1">THALASSAEMIC, HAEMOPHILIC, BLOOD CANCER PATIENTS!</p>
            <h1 className="text-xl font-bold mb-1">BLOOD CARE FOUNDATION</h1>
            <p className="text-sm font-medium mb-2">BLOOD TRANSFUSION AND HEMATOLOGICAL SERVICE</p>
            <div className="w-full h-1 bg-red-600 mb-4"></div>
            <h2 className="text-lg font-bold">Blood Issuing Blood Category Wise</h2>
          </div>

          <div className="border-2 border-black">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="border-b-2 border-black">
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">
                    Date
                  </TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">
                    Wb
                  </TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">
                    Pc
                  </TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">
                    FFP
                  </TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">
                    PLT's
                  </TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">
                    Cp
                  </TableHead>
                  <TableHead className="text-center font-bold bg-gray-100 text-black p-2">
                    Total Bags
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} className="border-b border-black">
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">
                      {row.date}
                    </TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">
                      {row.WB}
                    </TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">
                      {row.PC}
                    </TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">
                      {row.FFP}
                    </TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">
                      {row.PLT}
                    </TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">
                      {row.CP}
                    </TableCell>
                    <TableCell className="text-center text-sm p-2">
                      {row.total}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow className="border-t-2 border-black bg-gray-100">
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">
                    Total Bag:
                  </TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">
                    {totals.WB}
                  </TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">
                    {totals.PC}
                  </TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">
                    {totals.FFP}
                  </TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">
                    {totals.PLT}
                  </TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">
                    {totals.CP}
                  </TableCell>
                  <TableCell className="text-center font-bold text-sm p-2">
                    {totals.total}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        {data.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No blood issue data found for the selected criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductWiseBloodIssueTable;
