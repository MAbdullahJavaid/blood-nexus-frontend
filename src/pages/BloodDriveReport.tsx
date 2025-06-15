
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BloodDriveReportFilter from "@/components/reports/BloodDriveReportFilter";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

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

export default function BloodDriveReport() {
  // Fiscal year defaults
  const fiscalStart = new Date(2024, 6, 1); // July 1, 2024
  const fiscalEnd = new Date(2025, 5, 30);  // June 30, 2025

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: fiscalStart,
    to: fiscalEnd,
  });

  const { data: drives, isFetching, error } = useQuery({
    queryKey: ["blood-drive-report", dateRange.from, dateRange.to],
    queryFn: () => fetchBloodDrives(dateRange.from, dateRange.to),
  });

  // Filter callbacks
  function handleOk(from: Date, to: Date) {
    setDateRange({ from, to });
    toast({
      title: "Filter applied",
      description: `From ${from.toLocaleDateString()} to ${to.toLocaleDateString()}`,
    });
  }
  function handleCancel() {
    setDateRange({ from: fiscalStart, to: fiscalEnd });
    toast({
      title: "Filter cancelled"
    });
  }
  function handleExport() {
    toast({
      title: "Export",
      description: "Export not yet implemented."
    });
  }
  function handleExit() {
    window.history.back();
  }

  return (
    <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-2 tracking-wide">Blood Care Foundation</h1>
      <h2 className="text-xl italic underline mb-6 text-gray-700">Blood Drive Report</h2>
      <BloodDriveReportFilter
        onOk={handleOk}
        onCancel={handleCancel}
        onExport={handleExport}
        onExit={handleExit}
      />
      <div className="w-full max-w-4xl bg-white rounded shadow border mt-8 p-6">
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
