
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import BloodDriveReportFilter from "@/components/reports/BloodDriveReportFilter";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

type BloodDriveRequest = {
  id: string;
  contact_name: string;
  contact_email: string;
  phone: string;
  org_name: string | null;
  date_preference: string | null;
  location: string;
  additional_info: string | null;
  created_at: string;
};

async function fetchBloodDrives(from: Date, to: Date): Promise<BloodDriveRequest[]> {
  // Now filter by created_at (date & time) field (ISO format: with time)
  const fromISO = from.toISOString();
  // For inclusivity, set `to` to the last millisecond of that day
  const toISO = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999).toISOString();
  const { data, error } = await supabase
    .from("blood_drive_requests")
    .select("*")
    .gte("created_at", fromISO)
    .lte("created_at", toISO)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as BloodDriveRequest[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB");
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-GB");
}

function exportCsvWithHeadings(
  drives: BloodDriveRequest[] | undefined,
  from: Date,
  to: Date
) {
  if (!drives) {
    toast({
      title: "No Data",
      description: "There is no data to export.",
      variant: "destructive"
    });
    return;
  }

  // Report title and subtitle
  const title = "Blood Care Foundation";
  const subtitle = "Blood Drive Report";

  // Add filter range subtitle if needed
  const range = `From: ${from.toLocaleDateString()} To: ${to.toLocaleDateString()}`;

  // Table headers
  const headers = [
    "#",
    "Created At",
    "Date Preference",
    "Organization",
    "Contact Name",
    "Location",
    "Email",
    "Phone",
    "Additional Info"
  ];

  // Convert each row to CSV, escaping values if needed
  const csvRows = drives.map((drive, idx) => [
    idx + 1,
    formatDateTime(drive.created_at),
    formatDate(drive.date_preference),
    drive.org_name ?? "-",
    drive.contact_name,
    drive.location,
    drive.contact_email,
    drive.phone,
    drive.additional_info ?? "-"
  ]);

  // Combine everything
  let csvContent =
    `"${title}"\r\n` +
    `"${subtitle}"\r\n` +
    `"${range}"\r\n` +
    headers.map(h => `"${h}"`).join(",") + "\r\n" +
    csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\r\n");

  // Download as file
  const blob = new Blob([csvContent], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "blood_drive_report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast({
    title: "Exported!",
    description: "Blood Drive Report exported as CSV with headings.",
  });
}

// PDF Export
async function exportPdf(reportRef: React.RefObject<HTMLDivElement>, from: Date, to: Date) {
  const element = reportRef.current;
  if (!element) {
    toast({
      title: "Export Error",
      description: "Couldn't find report section for export.",
      variant: "destructive"
    });
    return;
  }
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const period = `_${from.toLocaleDateString("en-GB").replace(/\//g, "-")}_to_${to.toLocaleDateString("en-GB").replace(/\//g, "-")}`;
    pdf.save(`blood_drive_report${period}.pdf`);
    toast({ title: "Exported!", description: "Report exported as PDF." });
  } catch (e) {
    toast({
      title: "Export Error",
      description: "Failed to export PDF.",
      variant: "destructive"
    });
  }
}

// JPEG Export
async function exportJpeg(reportRef: React.RefObject<HTMLDivElement>, from: Date, to: Date) {
  const element = reportRef.current;
  if (!element) {
    toast({
      title: "Export Error",
      description: "Couldn't find report section for export.",
      variant: "destructive"
    });
    return;
  }
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    const link = document.createElement("a");
    const period = `_${from.toLocaleDateString("en-GB").replace(/\//g, "-")}_to_${to.toLocaleDateString("en-GB").replace(/\//g, "-")}`;
    link.download = `blood_drive_report${period}.jpeg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
    toast({ title: "Exported!", description: "Report exported as JPEG." });
  } catch (e) {
    toast({
      title: "Export Error",
      description: "Failed to export JPEG.",
      variant: "destructive"
    });
  }
}

export default function BloodDriveReport() {
  // Fiscal year defaults
  const fiscalStart = new Date(2024, 6, 1); // July 1, 2024
  const fiscalEnd = new Date(2025, 5, 30);  // June 30, 2025

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: fiscalStart,
    to: fiscalEnd,
  });

  const reportRef = useRef<HTMLDivElement>(null);

  const { data: drives, isFetching, error } = useQuery({
    queryKey: ["blood-drive-report", dateRange.from, dateRange.to],
    queryFn: () => fetchBloodDrives(dateRange.from, dateRange.to),
  });

  // Filter callbacks with enhanced logging
  function handleOk(from: Date, to: Date) {
    console.log('BloodDriveReport - OK handler called with dates:', from, to);
    setDateRange({ from, to });
    toast({
      title: "Filter applied",
      description: `Blood Drive Report: From ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`,
    });
  }

  function handleCancel() {
    console.log('BloodDriveReport - Cancel handler called');
    setDateRange({ from: fiscalStart, to: fiscalEnd });
    toast({
      title: "Filter cancelled",
      description: "Blood Drive Report filter reset to fiscal year",
    });
  }

  function handleExportCSV() {
    console.log('BloodDriveReport - Export CSV handler called');
    exportCsvWithHeadings(drives, dateRange.from, dateRange.to);
  }

  function handleExportPDF() {
    console.log('BloodDriveReport - Export PDF handler called');
    exportPdf(reportRef, dateRange.from, dateRange.to);
  }

  function handleExportJPEG() {
    console.log('BloodDriveReport - Export JPEG handler called');
    exportJpeg(reportRef, dateRange.from, dateRange.to);
  }

  function handleExit() {
    console.log('BloodDriveReport - Exit handler called');
    toast({
      title: "Exiting Report",
      description: "Leaving Blood Drive Report page",
    });
    window.history.back();
  }

  return (
    <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50">
      <BloodDriveReportFilter
        onOk={handleOk}
        onCancel={handleCancel}
        onExport={handleExportCSV}
        onExit={handleExit}
      />
      {/* Export buttons - PDF, JPEG, CSV */}
      <div className="w-full max-w-4xl flex justify-end gap-2 mb-4">
        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleExportCSV}>
          <Download className="w-4 h-4" />
          CSV
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleExportPDF}>
          <Download className="w-4 h-4" />
          PDF
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleExportJPEG}>
          <Download className="w-4 h-4" />
          JPEG
        </Button>
      </div>
      {/* Report Table for export */}
      <div ref={reportRef} className="w-full max-w-4xl bg-white rounded shadow border p-6">
        <Table>
          <TableCaption className="mb-4">
            {isFetching && <span>Loading blood drive requests...</span>}
            {error && <span className="text-red-600">Failed to load data</span>}
            {drives && drives.length === 0 && !isFetching && (
              <span>No blood drive requests found for selected dates.</span>
            )}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={9} className="text-center text-xl font-bold py-4 bg-gray-50">
                Blood Care Foundation
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead colSpan={9} className="text-center text-lg italic underline py-3 bg-gray-50">
                Blood Drive Report
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Date Preference</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Additional Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drives && drives.map((drive, idx) => (
              <TableRow key={drive.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{formatDateTime(drive.created_at)}</TableCell>
                <TableCell>{formatDate(drive.date_preference)}</TableCell>
                <TableCell>{drive.org_name ?? "-"}</TableCell>
                <TableCell>{drive.contact_name}</TableCell>
                <TableCell>{drive.location}</TableCell>
                <TableCell>
                  <a className="text-blue-600 underline" href={`mailto:${drive.contact_email}`}>
                    {drive.contact_email}
                  </a>
                </TableCell>
                <TableCell>
                  <a className="text-blue-600 underline" href={`tel:${drive.phone}`}>
                    {drive.phone}
                  </a>
                </TableCell>
                <TableCell>{drive.additional_info ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
