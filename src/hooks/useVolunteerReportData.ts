
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VolunteerFilter {
  from: Date;
  to: Date;
}

export const useVolunteerReportData = (filter: VolunteerFilter) => {
  return useQuery({
    queryKey: ["volunteers", filter.from.toISOString(), filter.to.toISOString()],
    queryFn: async () => {
      // Fetch volunteers where created_at >= from and created_at <= to
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .gte("created_at", filter.from.toISOString())
        .lte("created_at", filter.to.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};
