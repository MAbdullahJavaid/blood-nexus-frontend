
import { useState } from "react";
import { ShadcnDatePicker } from "@/components/ui/ShadcnDatePicker";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

interface DonationsReportFilterProps {
  onApply: (fromDate: string, toDate: string) => void;
  loading?: boolean;
}

export default function DonationsReportFilter({ onApply, loading }: DonationsReportFilterProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply(fromDate, toDate);
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarDays className="w-4 h-4" />
        Filter by Date
      </Button>

      {open && (
        <div className="mt-2 mb-6 bg-white shadow border rounded-lg p-4 flex flex-col gap-4 max-w-xs z-10">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <ShadcnDatePicker value={fromDate} onChange={setFromDate} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <ShadcnDatePicker value={toDate} onChange={setToDate} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button
              disabled={!fromDate || !toDate || loading}
              onClick={handleApply}
              type="button"
            >
              {loading ? "Loading..." : "Apply"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
