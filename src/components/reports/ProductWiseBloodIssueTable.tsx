
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
  FWB: number;
  WB: number;
  PC: number;
  FFP: number;
  PLT: number;
  CP: number;
  MEGAUNIT: number;
  total: number;
}

const COLUMNS = ["FWB", "WB", "PC", "FFP", "PLT", "CP", "MEGAUNIT"];

const ProductWiseBloodIssueTable = ({ category, fromDate, toDate }: ProductWiseBloodIssueTableProps) => {
  const [data, setData] = useState<BloodCategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState<{[k: string]: number; total: number}>({
    FWB: 0,
    WB: 0,
    PC: 0,
    FFP: 0,
    PLT: 0,
    CP: 0,
    MEGAUNIT: 0,
    total: 0
  });

  useEffect(() => {
    if (fromDate && toDate) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [category, fromDate, toDate]);

  const fetchData = async () => {
    if (!fromDate || !toDate) return;
    setLoading(true);
    try {
      // fetch only relevant fields
      let query = supabase
        .from('patient_invoices')
        .select("document_date, blood_category, bottle_quantity")
        .gte('document_date', fromDate.split('T')[0])
        .lte('document_date', toDate.split('T')[0])
        .not('blood_category', 'is', null)
        .not('bottle_quantity', 'is', null)
        .order('document_date', { ascending: true });

      // Apply category filter if set and not All
      if (category && category !== "All") {
        query = query.eq('blood_category', category);
      }

      const { data: invoiceData, error } = await query;
      if (error) {
        console.error("Error fetching invoice data:", error);
        setData([]);
        setTotals({
          FWB: 0, WB: 0, PC: 0, FFP: 0, PLT: 0, CP: 0, MEGAUNIT: 0, total: 0
        });
        setLoading(false);
        return;
      }

      // Group data by date string
      const grouped: {[date:string]: BloodCategoryData} = {};

      invoiceData?.forEach((record: any) => {
        const d = record.document_date ? format(new Date(record.document_date), 'dd/MM/yyyy') : '';
        if (!grouped[d]) {
          grouped[d] = { date: d, FWB: 0, WB: 0, PC: 0, FFP: 0, PLT: 0, CP: 0, MEGAUNIT: 0, total: 0 };
        }
        // Make sure `qty` is always a number
        let qty: number = 0;
        if (typeof record.bottle_quantity === "string") {
          qty = parseInt(record.bottle_quantity, 10) || 0;
        } else if (typeof record.bottle_quantity === "number") {
          qty = record.bottle_quantity;
        }
        const bc = (record.blood_category || '').toUpperCase().trim();

        // Map by FWB or WB, rest as-is
        if (bc === "FWB") {
          grouped[d].FWB += qty;
        } else if (bc === "WB") {
          grouped[d].WB += qty;
        } else if (bc === "PC") {
          grouped[d].PC += qty;
        } else if (bc === "FFP") {
          grouped[d].FFP += qty;
        } else if (bc === "PLT" || bc === "PLTS" || bc === "PLT'S") {
          grouped[d].PLT += qty;
        } else if (bc === "CP") {
          grouped[d].CP += qty;
        } else if (bc === "MEGAUNIT") {
          grouped[d].MEGAUNIT += qty;
        }
        // Always add to row total if a known column
        if (COLUMNS.includes(bc)) {
          grouped[d].total += qty;
        } else if (bc === "PLTS" || bc === "PLT'S") {
          grouped[d].total += qty;
        } else if (bc === "FWB" || bc === "WB" || bc === "PC" || bc === "FFP" || bc === "CP" || bc === "MEGAUNIT") {
          grouped[d].total += qty;
        }
      });

      // Compose output rows sorted by date
      const resultArr = Object.values(grouped).sort((a, b) => {
        const aa = new Date(a.date.split('/').reverse().join('-'));
        const bb = new Date(b.date.split('/').reverse().join('-'));
        return aa.getTime() - bb.getTime();
      });

      // Calculate foot totals
      const newTotals: {[k:string]:number} = {FWB:0, WB:0, PC:0, FFP:0, PLT:0, CP:0, MEGAUNIT:0, total:0};
      resultArr.forEach(row => {
        COLUMNS.forEach(col => {
          // Cast to number to avoid TypeScript error
          const value = Number(row[col as keyof BloodCategoryData]) || 0;
          newTotals[col] += value;
        });
        // Sum total, casting to number again
        newTotals.total += Number(row.total) || 0;
      });
      setData(resultArr);
      setTotals(newTotals as {[k: string]: number; total: number});
    } catch (error) {
      console.error("Error in fetchData:", error);
      setData([]);
      setTotals({
        FWB: 0, WB: 0, PC: 0, FFP: 0, PLT: 0, CP: 0, MEGAUNIT: 0, total: 0
      });
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
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">Date</TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">FWB</TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">WB</TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">PC</TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">FFP</TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">PLT's</TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">CP</TableHead>
                  <TableHead className="border-r-2 border-black text-center font-bold bg-gray-100 text-black p-2">Megaunit</TableHead>
                  <TableHead className="text-center font-bold bg-gray-100 text-black p-2">Total Bags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx} className="border-b border-black">
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">{row.date}</TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">{row.FWB}</TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">{row.WB}</TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">{row.PC}</TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">{row.FFP}</TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">{row.PLT}</TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">{row.CP}</TableCell>
                    <TableCell className="border-r-2 border-black text-center text-sm p-2">{row.MEGAUNIT}</TableCell>
                    <TableCell className="text-center text-sm p-2">{row.total}</TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow className="border-t-2 border-black bg-gray-100">
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">Total Bag:</TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">{totals.FWB}</TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">{totals.WB}</TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">{totals.PC}</TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">{totals.FFP}</TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">{totals.PLT}</TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">{totals.CP}</TableCell>
                  <TableCell className="border-r-2 border-black text-center font-bold text-sm p-2">{totals.MEGAUNIT}</TableCell>
                  <TableCell className="text-center font-bold text-sm p-2">{totals.total}</TableCell>
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
