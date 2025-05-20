
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useDonorForm } from "./DonorFormContext";

interface StatusSectionProps {
  isEditable: boolean;
}

const StatusSection = ({ isEditable }: StatusSectionProps) => {
  const { donorData, handleInputChange } = useDonorForm();
  
  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2">
        <Label htmlFor="status" className="mb-0">Status</Label>
        <Checkbox 
          id="status" 
          checked={donorData.status}
          onCheckedChange={(checked) => handleInputChange("status", !!checked)}
          disabled={!isEditable}
        />
      </div>
    </div>
  );
};

export default StatusSection;
