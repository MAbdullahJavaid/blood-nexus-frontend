
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBleedingForm } from "./BleedingFormContext";

const AddressSection = () => {
  const { selectedDonor } = useBleedingForm();

  return (
    <div className="mb-4">
      <Label htmlFor="address" className="mb-1 block">Address:</Label>
      <Input 
        id="address" 
        value={selectedDonor?.address || ""}
        className="h-9 bg-gray-50"
        readOnly
      />
    </div>
  );
};

export default AddressSection;
