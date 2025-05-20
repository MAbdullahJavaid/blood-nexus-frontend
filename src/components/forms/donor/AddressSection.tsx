
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDonorForm } from "./DonorFormContext";

interface AddressSectionProps {
  isEditable: boolean;
}

const AddressSection = ({ isEditable }: AddressSectionProps) => {
  const { donorData, handleInputChange } = useDonorForm();
  
  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div>
        <Label htmlFor="address" className="mb-1 block">Address</Label>
        <Input 
          id="address" 
          value={donorData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="h-9" 
          disabled={!isEditable}
        />
      </div>
    </div>
  );
};

export default AddressSection;
