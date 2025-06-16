
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShadcnDatePicker } from "@/components/ui/ShadcnDatePicker";
import { useBleedingForm } from "./BleedingFormContext";

interface HBAndDateSectionProps {
  isEditable: boolean;
}

const HBAndDateSection = ({
  isEditable,
}: HBAndDateSectionProps) => {
  const { donorPatientValues, handleDonorPatientValueChange, preparationDate, setPreparationDate } = useBleedingForm();
  
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
            onChange={(e) => handleDonorPatientValueChange("hb", e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>

      {/* Preparation Date */}
      <div className="flex items-center gap-2">
        <Label htmlFor="prepDate" className="whitespace-nowrap">Preparation Date:</Label>
        <ShadcnDatePicker
          value={preparationDate}
          onChange={setPreparationDate}
          disabled={!isEditable}
          placeholder="Select preparation date"
        />
      </div>
    </div>
  );
};

export default HBAndDateSection;
