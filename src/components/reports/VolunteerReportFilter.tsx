
import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ShadcnDatePicker } from "@/components/ui/ShadcnDatePicker";

type QuickSelectType = "thisFiscalYear" | "today" | "thisMonth" | "lastMonth";

interface VolunteerReportFilterProps {
  onOk: (from: Date, to: Date) => void;
  onCancel: () => void;
  onExport: () => void;
  onExit: () => void;
}

const getFiscalYearDates = () => {
  const now = new Date();
  // Fiscal year: July 1 of this or last year to June 30 of current or next year
  let from, to;
  if (now.getMonth() < 6) { // Before July, so previous fiscal starts last year
    from = new Date(now.getFullYear() - 1, 6, 1);
    to = new Date(now.getFullYear(), 5, 30);
  } else {
    from = new Date(now.getFullYear(), 6, 1);
    to = new Date(now.getFullYear() + 1, 5, 30);
  }
  return { from, to };
};

const getQuickSelectRange = (type: QuickSelectType) => {
  const now = new Date();
  switch (type) {
    case "thisFiscalYear": return getFiscalYearDates();
    case "today":
      return {
        from: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        to: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      };
    case "thisMonth":
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    case "lastMonth":
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        to: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    default: return getFiscalYearDates();
  }
};

const quickSelectOptions = [
  { label: "This Fiscal Year", value: "thisFiscalYear" },
  { label: "Today", value: "today" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" }
];

export default function VolunteerReportFilter({
  onOk,
  onCancel,
  onExport,
  onExit
}: VolunteerReportFilterProps) {
  // Set fiscal year as default
  const fiscal = getFiscalYearDates();
  const [from, setFrom] = useState<Date>(fiscal.from);
  const [to, setTo] = useState<Date>(fiscal.to);
  const [quickSelect, setQuickSelect] = useState<QuickSelectType>("thisFiscalYear");

  // When quick select changes, update from/to
  const handleQuickSelect = (val: QuickSelectType) => {
    setQuickSelect(val);
    const dates = getQuickSelectRange(val);
    setFrom(dates.from);
    setTo(dates.to);
  };

  // Update from/to if user picks them manually (resets quick select)
  const handleFromChange = (val: string) => {
    const picked = val ? new Date(val) : undefined;
    if (picked && !isNaN(picked.getTime())) setFrom(picked);
    setQuickSelect(undefined as any);
  };
  const handleToChange = (val: string) => {
    const picked = val ? new Date(val) : undefined;
    if (picked && !isNaN(picked.getTime())) setTo(picked);
    setQuickSelect(undefined as any);
  };

  // Format date as dd/MM/yyyy for input display
  const formatDate = (d: Date) =>
    d
      ? d
          .toLocaleDateString("en-GB")
          .split("/")
          .map((part) => part.padStart(2, "0"))
          .join("/")
      : "";

  return (
    <Card className="max-w-4xl mx-auto mb-6 p-0 overflow-visible">
      <CardHeader className="bg-yellow-100 border-b rounded-t-lg px-6 py-4">
        <CardTitle className="flex gap-2 items-center text-lg">
          <span role="img" aria-label="chart">📊</span>
          Report Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="flex items-center gap-2 pb-2">
            <span className="text-green-700 text-lg">🔍</span>
            <span className="font-medium text-gray-800 text-lg">Filter</span>
          </div>

          {/* Table-like Filter */}
          <div className="border border-gray-300 rounded overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-200 border-b">
              <div className="p-3 border-r text-center font-medium">Column</div>
              <div className="p-3 border-r text-center font-medium">From</div>
              <div className="p-3 text-center font-medium">To</div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-3">
              <div className="p-3 border-r bg-gray-50 flex items-center gap-2">
                <span className="font-medium">Dates:</span>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={quickSelect}
                  onChange={e => handleQuickSelect(e.target.value as QuickSelectType)}
                  style={{ minWidth: 120 }}
                >
                  {quickSelectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="p-3 border-r">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {from ? formatDate(from) : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <ShadcnDatePicker
                        value={from ? from.toISOString().slice(0, 10) : ""}
                        onChange={handleFromChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {to ? formatDate(to) : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <ShadcnDatePicker
                        value={to ? to.toISOString().slice(0, 10) : ""}
                        onChange={handleToChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4 flex-wrap">
            <Button
              className="px-8 bg-red-600 hover:bg-red-700"
              onClick={() => onOk(from, to)}
              style={{ color: "#fff" }}
            >
              OK
            </Button>
            <Button variant="outline" onClick={onCancel} className="px-8">
              Cancel
            </Button>
            <Button
              className="px-8 bg-green-600 hover:bg-green-700"
              onClick={onExport}
              style={{ color: "#fff" }}
            >
              Export
            </Button>
            <Button variant="outline" onClick={onExit} className="px-8">
              Exit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
