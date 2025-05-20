
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBleedingForm } from "./BleedingFormContext";

const BloodGroupSection = () => {
  const { selectedDonor } = useBleedingForm();

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <Label htmlFor="group" className="mb-1 block">Group:</Label>
        <Input 
          id="group" 
          value={selectedDonor?.blood_group || ""}
          className="h-9 bg-gray-50"
          readOnly
        />
      </div>
      <div>
        <Label htmlFor="rh" className="mb-1 block">Rh:</Label>
        <Input 
          id="rh" 
          value={selectedDonor?.blood_group?.includes('+') ? '+ve' : selectedDonor?.blood_group?.includes('-') ? '-ve' : ""}
          className="h-9 bg-gray-50"
          readOnly
        />
      </div>
    </div>
  );
};

export default BloodGroupSection;
