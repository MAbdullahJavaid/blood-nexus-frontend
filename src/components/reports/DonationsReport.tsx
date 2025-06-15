import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TableCaption,
} from "@/components/ui/table";
import { DollarSign, Mail, CalendarDays, CircleCheck, CircleX } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const dateOptions = [
  { label: "This Fiscal Year", value: "fiscal" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisweek" },
  { label: "This Month", value: "thismonth" },
];

// Util: format as dd/MM/yyyy
function formatDDMMYYYY(date: Date) {
  return format(date, "dd/MM/yyyy");
}
// Util: parse dd/MM/yyyy to Date
function parseDDMMYYYY(val: string): Date | null {
  const [d, m, y] = val.split("/");
  if (!d || !m || !y) return null;
  const result = new Date(Number(y), Number(m)-1, Number(d));
  return isNaN(result.getTime()) ? null : result;
}

function getDefaultDates(option: string): {from: Date; to: Date} {
  const today = new Date();
  let from = today;
  let to = today;

  switch(option) {
    case "fiscal":
      // Fiscal Year: 01/07/2024 - 30/06/2025
      from = new Date(2024, 6, 1); // July is 6 (0-indexed)
      to = new Date(2025, 5, 30);
      break;
    case "today":
      from = to = today;
      break;
    case "yesterday":
      from = to = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      break;
    case "thisweek": {
      from = startOfWeek(today, {weekStartsOn: 1}); // Monday
      to = today;
      break;
    }
    case "thismonth": {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    }
    default:
      from = to = today;
  }
  return {from, to};
}

type Donation = {
  id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format((amount || 0) / 100);
}

function statusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-100 text-green-700 border-green-200"><CircleCheck className="inline w-4 h-4 mr-1" />Paid</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><DollarSign className="inline w-4 h-4 mr-1" />Pending</Badge>;
    case "canceled":
      return <Badge className="bg-red-100 text-red-700 border-red-200"><CircleX className="inline w-4 h-4 mr-1" />Canceled</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200 capitalize">{status}</Badge>;
  }
}

// -- Filtered DonationsReport
export default function DonationsReport() {
  // Filter State
  const [selectedOption, setSelectedOption] = useState("fiscal");
  const [fromDateStr, setFromDateStr] = useState(formatDDMMYYYY(getDefaultDates("fiscal").from));
  const [toDateStr, setToDateStr] = useState(formatDDMMYYYY(getDefaultDates("fiscal").to));
  const [showResults, setShowResults] = useState(false);

  // Date objects
  const fromDate = parseDDMMYYYY(fromDateStr);
  const toDate = parseDDMMYYYY(toDateStr);

  // Auto update from/to when dropdown changes
  function handleOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedOption(val);
    const {from, to} = getDefaultDates(val);
    setFromDateStr(formatDDMMYYYY(from));
    setToDateStr(formatDDMMYYYY(to));
    setShowResults(false); // hide results if dates were auto-updated
  }

  // DatePicker handling for manual edits
  function handleFromCalendar(date: Date|undefined) {
    if (!date) return;
    setFromDateStr(formatDDMMYYYY(date));
  }
  function handleToCalendar(date: Date|undefined) {
    if (!date) return;
    setToDateStr(formatDDMMYYYY(date));
  }
  // Manual input
  function handleFromInput(e: React.ChangeEvent<HTMLInputElement>) {
    setFromDateStr(e.target.value);
  }
  function handleToInput(e: React.ChangeEvent<HTMLInputElement>) {
    setToDateStr(e.target.value);
  }

  function handleOK() {
    setShowResults(true);
  }
  function handleCancel() {
    setSelectedOption("fiscal");
    const {from, to} = getDefaultDates("fiscal");
    setFromDateStr(formatDDMMYYYY(from));
    setToDateStr(formatDDMMYYYY(to));
    setShowResults(false);
  }
  function handleExport() {
    // Intentionally left blank, implement later
    alert("Export functionality coming soon!");
  }
  function handleExit() {
    window.location.href = "/dashboard";
  }

  // Get user info
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["donations-user"],
    queryFn: async () => {
      const { data: result, error } = await supabase.auth.getUser();
      if (error) throw error;
      return result.user;
    }
  });

  // Get user role (for admin check)
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["donations-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: profiles, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return profiles;
    },
    enabled: !!user?.id,
  });
  const isAdmin = profile?.role === "admin";

  // Query Donations (only after OK)
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [
      "donations-report-by-filter",
      fromDateStr,
      toDateStr,
      isAdmin,
      showResults
    ],
    queryFn: async () => {
      let query = supabase.from("donations").select("*").order("created_at", { ascending: false });
      if (!isAdmin && user?.id) {
        query = query.eq("user_id", user.id);
      }
      // Parse as yyyy-MM-dd for Supabase filtering
      if (fromDate) query = query.gte("created_at", `${fromDate.getFullYear()}-${(fromDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${fromDate.getDate().toString().padStart(2, "0")}T00:00:00.000Z`);
      if (toDate) query = query.lte("created_at", `${toDate.getFullYear()}-${(toDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${toDate.getDate().toString().padStart(2, "0")}T23:59:59.999Z`);
      const { data, error } = await query;
      if (error) throw error;
      return data as Donation[];
    },
    enabled: !!(user && profile && showResults),
  });

  const grandTotal = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data.reduce((acc, d) => acc + (d.amount || 0), 0);
  }, [data]);

  const currency = data && data.length > 0 ? data[0].currency : "USD";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-blood" />
        <h2 className="text-3xl font-bold">Donations Report</h2>
      </div>
      {/* --- Filter UI --- */}
      <Card className="mb-6 shadow border border-muted max-w-4xl mx-auto">
        <div className="bg-yellow-100 border-b px-6 py-3 rounded-t-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-semibold text-lg">Report Filter</span>
          </div>
        </div>
        <div className="p-6">
          {/* Filter header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600">🔍</span>
            <span className="font-medium">Filter</span>
          </div>
          {/* Filter Table */}
          <div className="border border-gray-300">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-200 border-b">
              <div className="p-3 border-r text-center font-medium">Column</div>
              <div className="p-3 border-r text-center font-medium">From</div>
              <div className="p-3 text-center font-medium">To</div>
            </div>
            {/* Dates Row */}
            <div className="grid grid-cols-3 bg-white">
              {/* Dropdown */}
              <div className="p-3 border-r flex items-center gap-2 bg-gray-50">
                <label className="font-medium mr-2">Dates:</label>
                <select
                  className="border rounded px-2 py-2 text-sm bg-white"
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  {dateOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              {/* From Date */}
              <div className="p-3 border-r">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "w-full justify-start text-left h-10 font-normal px-3",
                        !fromDateStr && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 w-4 h-4 text-gray-400" />
                      {fromDateStr || <span>dd/mm/yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate ?? undefined}
                      onSelect={handleFromCalendar}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* To Date */}
              <div className="p-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "w-full justify-start text-left h-10 font-normal px-3",
                        !toDateStr && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 w-4 h-4 text-gray-400" />
                      {toDateStr || <span>dd/mm/yyyy</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate ?? undefined}
                      onSelect={handleToCalendar}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-7">
            <Button
              variant="default"
              className="px-10 bg-red-600 hover:bg-red-700"
              style={{ color: "white" }}
              onClick={handleOK}
            >
              OK
            </Button>
            <Button
              variant="outline"
              className="px-10"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="px-10 bg-green-600 hover:bg-green-700"
              style={{ color: "white" }}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="outline"
              className="px-10"
              onClick={handleExit}
            >
              Exit
            </Button>
          </div>
        </div>
      </Card>
      {/* End Filter */}

      {/* Table/Result */}
      {userLoading || profileLoading ? (
        <p className="text-gray-500 mt-6">Loading user info...</p>
      ) : !showResults ? (
        <Card>
          <div className="text-center py-16 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results found. Use the filters above to generate the report.</p>
          </div>
        </Card>
      ) : isLoading || isRefetching ? (
        <p className="text-gray-500 mt-6">Loading donations...</p>
      ) : error ? (
        <div className="text-red-500 mt-6">Failed to load donations.</div>
      ) : !data || data.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 shadow text-center mt-6">
          No donations found for selected date range.
        </div>
      ) : (
        <Card className="mt-6 shadow-md border border-border overflow-x-auto">
          <Table>
            <TableCaption>
              Showing {data.length} donations
              {fromDateStr && toDateStr
                ? ` from ${fromDateStr} to ${toDateStr}`
                : ""}
              .
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Donation ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((donation, i) => (
                <TableRow key={donation.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{statusBadge(donation.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      <span>{formatDDMMYYYY(new Date(donation.created_at))}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {formatAmount(donation.amount, donation.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-mono break-all">{donation.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">
                      {donation.id.slice(0, 8)}...
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-right font-bold uppercase tracking-wider"
                >
                  Grand Total
                </TableCell>
                <TableCell className="font-bold text-green-700">
                  {formatAmount(grandTotal, currency)}
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
      )}
    </div>
  );
}

// This file is now >230 lines. Please consider refactoring it into smaller files and components for easier maintenance.
