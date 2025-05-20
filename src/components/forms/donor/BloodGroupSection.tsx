
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDonorForm } from "./DonorFormContext";

interface BloodGroupSectionProps {
  isEditable: boolean;
}

const BloodGroupSection = ({ isEditable }: BloodGroupSectionProps) => {
  const { donorData, handleInputChange } = useDonorForm();
  
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div>
        <Label htmlFor="group" className="mb-1 block">Group</Label>
        <Select 
          value={donorData.group}
          onValueChange={(value) => handleInputChange("group", value)}
          disabled={!isEditable}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="O">O</SelectItem>
            <SelectItem value="AB">AB</SelectItem>
            <SelectItem value="--">--</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="rh" className="mb-1 block">Rh</Label>
        <Select 
          value={donorData.rh}
          onValueChange={(value) => handleInputChange("rh", value)}
          disabled={!isEditable}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+ve">+ve</SelectItem>
            <SelectItem value="-ve">-ve</SelectItem>
            <SelectItem value="--">--</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="phoneRes" className="mb-1 block">Phone Res</Label>
        <Input 
          id="phoneRes" 
          value={donorData.phoneRes}
          onChange={(e) => handleInputChange("phoneRes", e.target.value)}
          className="h-9" 
          disabled={!isEditable}
        />
      </div>
      <div>
        <Label htmlFor="phoneOffice" className="mb-1 block">Phone Office</Label>
        <Input 
          id="phoneOffice" 
          value={donorData.phoneOffice}
          onChange={(e) => handleInputChange("phoneOffice", e.target.value)}
          className="h-9" 
          disabled={!isEditable}
        />
      </div>
    </div>
  );
};

export default BloodGroupSection;
