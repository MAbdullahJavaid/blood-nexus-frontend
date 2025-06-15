
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter, TableCaption } from "@/components/ui/table";
import { DollarSign, Mail, CalendarDays, CircleCheck, CircleX } from "lucide-react";
import BDSReportFilter from "./BDSReportFilter";

// Get user and profile info
function useUserProfile() {
  const { data, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["supabase-user"],
    queryFn: async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user.user;
    }
  });

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["user-profile", data?.id],
    queryFn: async () => {
      if (!data?.id) return null;
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.id)
        .maybeSingle();
      if (error) throw error;
      return profiles;
    },
    enabled: !!data?.id
  });

  return {
    user: data,
    profile,
    isLoading: userLoading || profileLoading,
    error: userError || profileError
  };
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

export default function DonationsReport() {
  // Use BDSReportFilter-style filter state and logic
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [showResults, setShowResults] = useState(false);

  // Get admin/user
  const { user, profile, isLoading: isProfileLoading, error: profileError } = useUserProfile();
  const isAdmin = profile?.role === "admin";

  // Fetch donations - enable only if filters are applied and user role loaded
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [
      "donations-report-bds-style",
      fromDate?.toISOString(),
      toDate?.toISOString(),
      isAdmin
    ],
    queryFn: async () => {
      let query = supabase.from("donations").select("*").order("created_at", { ascending: false });
      // Only add user filter if NOT admin
      if (!isAdmin && user?.id) {
        query = query.eq("user_id", user.id);
      }
      if (fromDate) query = query.gte("created_at", fromDate.toISOString().slice(0, 10) + "T00:00:00.000Z");
      if (toDate) query = query.lte("created_at", toDate.toISOString().slice(0, 10) + "T23:59:59.999Z");
      const { data, error } = await query;
      if (error) throw error;
      return data as Donation[];
    },
    enabled: !!(user && (isAdmin !== undefined) && showResults) // Only fetch after filter "OK"
  });

  // Show grand total
  const grandTotal = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return data.reduce((acc, d) => acc + (d.amount || 0), 0);
  }, [data]);

  const currency = data && data.length > 0 ? data[0].currency : "USD";

  // Handler for BDSReportFilter
  // BDSReportFilter uses "OK" to apply filter, "Cancel" to reset
  function handleOK(filter: { fromDate?: Date; toDate?: Date }) {
    setFromDate(filter.fromDate);
    setToDate(filter.toDate);
    setShowResults(true);
  }
  function handleCancel() {
    setFromDate(undefined);
    setToDate(undefined);
    setShowResults(false);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-blood" />
        <h2 className="text-3xl font-bold">Donations Report</h2>
      </div>
      <BDSReportFilter
        title="Donations Report"
        // Pass no reportType, disables table rendering inside filter
        reportType={undefined}
        // @ts-ignore - hack: override OK/Cancel buttons
        okButtonLabel="Show"
        onOK={handleOK}
        onCancel={handleCancel}
        // Do not break existing filter UI, ignore props that don't exist
      />

      {/* Show table/results after user clicks OK in filter (matching Blood Bleeded Record) */}
      {isProfileLoading ? (
        <p className="text-gray-500 mt-6">Loading user info...</p>
      ) : profileError ? (
        <div className="text-red-500 mt-6">Failed to load user profile.</div>
      ) : showResults ? (
        isLoading || isRefetching ? (
          <p className="text-gray-500 mt-6">Loading donations...</p>
        ) : error ? (
          <div className="text-red-500 mt-6">Failed to load donations.</div>
        ) : !data || data.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 shadow text-center mt-6">
            No donations found{fromDate && toDate ? " for selected date range." : "."}
          </div>
        ) : (
          <Card className="mt-6 shadow-md border border-border overflow-x-auto">
            <Table>
              <TableCaption>
                Showing {data.length} donations
                {fromDate && toDate
                  ? ` from ${fromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()}`
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
                        <span>{new Date(donation.created_at).toLocaleDateString()}</span>
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
                      <span className="font-mono text-xs">{donation.id.slice(0, 8)}...</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold uppercase tracking-wider">
                    Grand Total
                  </TableCell>
                  <TableCell className="font-bold text-green-700">{formatAmount(grandTotal, currency)}</TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
        )
      ) : (
        <Card>
          <div className="text-center py-16 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No results found. Use the filters above to generate the report.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
