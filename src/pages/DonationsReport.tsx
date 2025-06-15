import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DonationsReportFilter from "@/components/reports/DonationsReportFilter";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";

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
  // Fetches all 'paid' donations within the date range (inclusive)
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .gte("created_at", from.toISOString())
    .lte("created_at", to.toISOString())
    .eq("status", "paid")
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

  return (
    <div className="p-8 flex flex-col items-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-2 tracking-wide">Blood Care Foundation</h1>
      <h2 className="text-xl italic underline mb-6 text-gray-700">Donation Summary</h2>
      {/* Filter */}
      <DonationsReportFilter
        onOk={handleOk}
        onCancel={handleCancel}
        onExport={handleExport}
        onExit={handleExit}
      />
      {/* Table */}
      <div className="w-full max-w-2xl bg-white rounded shadow border mt-8 p-6">
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
