
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Mail, CalendarDays, CircleCheck, CircleX } from "lucide-react";
import DonationsReportFilter from "./DonationsReportFilter";

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
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Fetch donations, optionally filtered by date range
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["donations-report", fromDate, toDate],
    queryFn: async () => {
      let query = supabase.from("donations").select("*").order("created_at", { ascending: false });

      if (fromDate) query = query.gte("created_at", fromDate + "T00:00:00.000Z");
      if (toDate) query = query.lte("created_at", toDate + "T23:59:59.999Z");

      const { data, error } = await query;
      if (error) throw error;
      return data as Donation[];
    }
  });

  const handleFilterApply = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    // The query will refetch automatically because keys changed
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex gap-3 items-center">
        <DollarSign className="text-blood" />
        Donations Report
      </h2>

      {/* Filter Panel */}
      <DonationsReportFilter onApply={handleFilterApply} loading={isLoading || isRefetching} />

      {isLoading ? (
        <p className="text-gray-500 mt-6">Loading donations...</p>
      ) : error ? (
        <div className="text-red-500 mt-6">Failed to load donations.</div>
      ) : !data || data.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 shadow text-center mt-6">
          No donations found{fromDate && toDate ? " for selected date range." : "."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in mt-6">
          {data.map(donation => (
            <Card key={donation.id} className={cn(
              "shadow-lg border border-border hover:shadow-2xl transition-shadow duration-200 hover:scale-105", 
              donation.status === "paid" ? "border-green-200" : donation.status === "pending" ? "border-yellow-200" : "border-gray-200"
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  {statusBadge(donation.status)}
                  <span className="text-xs text-gray-400 flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1 inline" />
                    {new Date(donation.created_at).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="mt-4 flex flex-row items-center gap-2 font-bold text-lg">
                  <DollarSign className="text-green-600" />
                  {formatAmount(donation.amount, donation.currency)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-mono break-all">{donation.email}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Donation&nbsp;ID: <span className="font-mono">{donation.id.slice(0, 8)}...</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
