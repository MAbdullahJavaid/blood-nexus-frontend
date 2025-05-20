
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDonorForm } from "./DonorFormContext";

interface DemographicsSectionProps {
  isEditable: boolean;
}

const DemographicsSection = ({ isEditable }: DemographicsSectionProps) => {
  const { donorData, handleInputChange } = useDonorForm();
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="age" className="mb-1 block">Age</Label>
        <Input 
          id="age" 
          type="number" 
          value={donorData.age}
          onChange={(e) => handleInputChange("age", e.target.value)}
          className="h-9" 
          disabled={!isEditable}
        />
      </div>
      <div>
        <Label htmlFor="sex" className="mb-1 block">Sex</Label>
        <Select 
          value={donorData.sex} 
          onValueChange={(value) => handleInputChange("sex", value)}
          disabled={!isEditable}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div></div>
    </div>
  );
};

export default DemographicsSection;
