
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DonorPatientValues } from "./types";

interface HBAndDateSectionProps {
  donorPatientValues: DonorPatientValues;
  isEditable: boolean;
  formattedDate: string;
  onValueChange: (test: keyof DonorPatientValues, value: string) => void;
}

const HBAndDateSection = ({
  donorPatientValues,
  isEditable,
  formattedDate,
  onValueChange,
}: HBAndDateSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-4">
      {/* HB% */}
      <div className="border p-3 rounded-md">
        <div className="text-red-600 font-medium mb-2">HB%</div>
        <div className="grid grid-cols-2 gap-2">
          <Label htmlFor="hbValue" className="mb-1 block">Donor/Patient Value:</Label>
          <Input 
            id="hbValue" 
            className="h-8"
            value={donorPatientValues.hb}
            onChange={(e) => onValueChange("hb", e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>

      {/* Preparation Date */}
      <div className="flex items-center gap-2">
        <Label htmlFor="prepDate" className="whitespace-nowrap">Preparation Date:</Label>
        <Input 
          id="prepDate" 
          type="text" 
          className="h-8 bg-gray-50" 
          value={formattedDate} 
          readOnly 
        />
      </div>
    </div>
  );
};

export default HBAndDateSection;
