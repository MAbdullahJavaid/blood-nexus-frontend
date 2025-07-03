import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DonationsReportFilter from "@/components/reports/DonationsReportFilter";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "@/hooks/use-toast";

type Donation = {
  id: string;
  user_id: string | null;
  amount: number;
  created_at: string;
  status: string;
  currency: string;
  email: string;
};

async function fetchDonations(from: Date, to: Date): Promise<Donation[]> {
  // Fetches all donations within the date range (inclusive), regardless of status
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .gte("created_at", from.toISOString())
    .lte("created_at", to.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Donation[];
}

function formatDate(dateString: string): string {
  // Format date as dd/MM/yyyy
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB");
}

function formatCurrency(amount: number, currency = "USD") {
  // Amount is assumed in cents (e.g. 500 -> 5.00)
  return (
    (currency.toUpperCase() === "USD" ? "$" : "") +
    (amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })
  );
}

export default function DonationsReport() {
  // Initial range: this fiscal year
  const fiscalStart = (() => {
    const today = new Date();
    return today.getMonth() < 6
      ? new Date(today.getFullYear() - 1, 6, 1)
      : new Date(today.getFullYear(), 6, 1);
  })();
  const fiscalEnd = (() => {
    const fy = fiscalStart.getFullYear() + 1;
    return new Date(fy, 5, 30, 23, 59, 59, 999); // 30 June next year, end of day
  })();

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: fiscalStart,
    to: fiscalEnd,
  });

  // Make query depend on dateRange
  const { data: donations, isFetching, error, refetch } = useQuery({
    queryKey: ["donations-report", dateRange.from, dateRange.to],
    queryFn: () => fetchDonations(dateRange.from, dateRange.to),
  });

  // Handlers for the filter
  const handleOk = (from: Date, to: Date) => {
    setDateRange({ from, to });
    // Query will automatically refetch due to queryKey dependency
  };

  const handleCancel = () => {
    // Optionally reset to default
    setDateRange({ from: fiscalStart, to: fiscalEnd });
  };

  const handleExport = () => {
    // Optionally implement export
    alert("Export not yet implemented.");
  };

  const handleExit = () => {
    window.history.back();
  };

  // Calculate grand total of all donations shown (sum of amount)
  const grandTotal =
    donations && donations.length > 0
      ? donations.reduce((sum, d) => sum + d.amount, 0)
      : 0;

  // EXPORT PDF
  const handleExportPDF = async () => {
    const tableElement = document.getElementById("donations-report-table");
    if (!tableElement) {
      toast({
        title: "Export error",
        description: "Could not find the report content to export.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Exporting PDF",
        description: "Generating PDF, please wait...",
      });

      // Hide export buttons in PDF
      const exportButtons = document.querySelectorAll('.export-hide');
      exportButtons.forEach(el => (el as HTMLElement).style.display = 'none');

      const canvas = await html2canvas(tableElement, {
        useCORS: true,
        backgroundColor: "#fff",
        scale: 2,
        logging: false
      });

      exportButtons.forEach(el => (el as HTMLElement).style.display = '');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgWidth = 297; // landscape
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('donations-report.pdf');

      toast({
        title: "PDF Exported",
        description: "PDF saved to your device!",
      });
    } catch (err) {
      toast({
        title: "Export Error",
        description: "Could not export as PDF.",
        variant: "destructive"
      });
    }
  };

  // EXPORT JPEG
  const handleExportJPEG = async () => {
    const tableElement = document.getElementById("donations-report-table");
    if (!tableElement) {
      toast({
        title: "Export error",
        description: "Could not find the report content to export.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Exporting JPEG",
        description: "Generating JPEG, please wait...",
      });
      // Hide export buttons in JPEG
      const exportButtons = document.querySelectorAll('.export-hide');
      exportButtons.forEach(el => (el as HTMLElement).style.display = 'none');
      const canvas = await html2canvas(tableElement, {
        useCORS: true,
        backgroundColor: "#fff",
        scale: 2,
        logging: false
      });
      exportButtons.forEach(el => (el as HTMLElement).style.display = '');

      const link = document.createElement("a");
      link.download = "donations-report.jpg";
      link.href = canvas.toDataURL("image/jpeg", 0.94);
      link.click();

      toast({
        title: "JPEG Exported",
        description: "JPEG saved to your device!",
      });
    } catch (err) {
      toast({
        title: "Export Error",
        description: "Could not export as JPEG.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50">
      {/* Filter */}
      <DonationsReportFilter
        onOk={handleOk}
        onCancel={handleCancel}
        onExport={handleExport}
        onExit={handleExit}
      />
      {/* Table */}
      <div id="donations-report-table" className="w-full max-w-2xl bg-white rounded shadow border mt-4 p-6">
        <div className="flex gap-2 mb-4 export-hide">
          {/* Both export buttons now use the File icon */}
          <Button onClick={handleExportPDF} variant="default" className="flex items-center gap-2" size="sm">
            <File className="h-4 w-4" /> Export PDF
          </Button>
          <Button onClick={handleExportJPEG} variant="outline" className="flex items-center gap-2" size="sm">
            <File className="h-4 w-4" /> Export JPEG
          </Button>
        </div>
        <Table>
          <TableCaption>
            {isFetching && <span>Loading donations...</span>}
            {error && <span className="text-red-600">Failed to load data</span>}
            {!isFetching && donations && donations.length === 0 && (
              <span>No donations found for selected dates.</span>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={5} className="text-center text-xl font-bold py-4 bg-gray-50">
                Blood Care Foundation
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead colSpan={5} className="text-center text-lg italic underline py-3 bg-gray-50">
                Donation Summary
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Donor Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations &&
              donations.map((d, idx) => (
                <TableRow key={d.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>{formatDate(d.created_at)}</TableCell>
                  <TableCell>{formatCurrency(d.amount, d.currency)}</TableCell>
                  <TableCell className="capitalize">{d.status}</TableCell>
                </TableRow>
              ))}

            {donations && donations.length > 0 && (
              <TableRow className="font-bold border-t-2 border-black">
                <TableCell colSpan={3} className="text-right pr-6">
                  Grand Total
                </TableCell>
                <TableCell>
                  {formatCurrency(grandTotal, donations[0].currency)}
                </TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
