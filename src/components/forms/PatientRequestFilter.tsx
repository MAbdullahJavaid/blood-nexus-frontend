
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ReportFilter from "./ReportFilter";

interface PatientRequestFilterProps {
  onApplyFilter: (fromDocNo: string, toDocNo: string) => void;
}

const PatientRequestFilter = ({ onApplyFilter }: PatientRequestFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilter = (fromCode: string, toCode: string) => {
    onApplyFilter(fromCode, toCode);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsFilterOpen(true)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filter Reports
      </Button>

      <ReportFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
        title="Report Filter"
        codeLabel="Code:"
      />
    </>
  );
};

export default PatientRequestFilter;
