
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDonorForm } from "./DonorFormContext";

interface RemarksSectionProps {
  isEditable: boolean;
}

const RemarksSection = ({ isEditable }: RemarksSectionProps) => {
  const { donorData, handleInputChange } = useDonorForm();
  
  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div>
        <Label htmlFor="remarks" className="mb-1 block">Remarks</Label>
        <Textarea 
          id="remarks" 
          value={donorData.remarks}
          onChange={(e) => handleInputChange("remarks", e.target.value)}
          className="min-h-[100px]" 
          disabled={!isEditable}
        />
      </div>
    </div>
  );
};

export default RemarksSection;
