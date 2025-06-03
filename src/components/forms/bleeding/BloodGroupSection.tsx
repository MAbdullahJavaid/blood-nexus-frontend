
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBleedingForm } from "./BleedingFormContext";

const BloodGroupSection = () => {
  const { selectedDonor } = useBleedingForm();

  // Get blood group and rh from separate fields with fallback to combined field
  const getBloodGroup = () => {
    if (selectedDonor?.blood_group_separate) {
      return selectedDonor.blood_group_separate;
    }
    // Fallback to parsing combined field
    return selectedDonor?.blood_group?.replace(/[+-]/g, '') || "";
  };

  const getRhFactor = () => {
    if (selectedDonor?.rh_factor) {
      return selectedDonor.rh_factor;
    }
    // Fallback to parsing combined field
    if (selectedDonor?.blood_group?.includes('+')) return '+ve';
    if (selectedDonor?.blood_group?.includes('-')) return '-ve';
    return "";
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <Label htmlFor="group" className="mb-1 block">Group:</Label>
        <Input 
          id="group" 
          value={getBloodGroup()}
          className="h-9 bg-green-100"
          readOnly
        />
      </div>
      <div>
        <Label htmlFor="rh" className="mb-1 block">Rh:</Label>
        <Input 
          id="rh" 
          value={getRhFactor()}
          className="h-9 bg-green-100"
          readOnly
        />
      </div>
    </div>
  );
};

export default BloodGroupSection;
