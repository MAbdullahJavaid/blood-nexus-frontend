
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Mail, CalendarDays, CircleCheck, CircleX } from "lucide-react";

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
  // Fetch all donations
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-donations-report"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Donation[];
    }
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex gap-3 items-center">
        <DollarSign className="text-blood" />
        Donations Report
      </h2>
      {isLoading ? (
        <p className="text-gray-500">Loading donations...</p>
      ) : error ? (
        <div className="text-red-500">Failed to load donations.</div>
      ) : !data || data.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 shadow text-center">
          No donations found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
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

