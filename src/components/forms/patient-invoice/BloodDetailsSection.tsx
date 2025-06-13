
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BloodDetailsSectionProps {
  bloodGroup?: string;
  rhType?: string;
  bloodCategory: string;
  bottleRequired?: number;
  bottleUnitType: string;
  isEditable: boolean;
  onBloodGroupChange?: (value: string) => void;
  onRhTypeChange?: (value: string) => void;
  onBloodCategoryChange: (value: string) => void;
  onBottleRequiredChange?: (value: number) => void;
  onBottleUnitTypeChange: (value: string) => void;
}

export function BloodDetailsSection({
  bloodGroup = "N/A",
  rhType = "N/A",
  bloodCategory,
  bottleRequired = 0,
  bottleUnitType,
  isEditable,
  onBloodGroupChange,
  onRhTypeChange,
  onBloodCategoryChange,
  onBottleRequiredChange,
  onBottleUnitTypeChange
}: BloodDetailsSectionProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div>
        <Label htmlFor="bloodGroup" className="mb-1 block">Blood Group:</Label>
        <Select value={bloodGroup} onValueChange={onBloodGroupChange} disabled={!isEditable}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="AB">AB</SelectItem>
            <SelectItem value="O">O</SelectItem>
            <SelectItem value="N/A">N/A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="rh" className="mb-1 block">RH:</Label>
        <Select value={rhType} onValueChange={onRhTypeChange} disabled={!isEditable}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+ve">+ve</SelectItem>
            <SelectItem value="-ve">-ve</SelectItem>
            <SelectItem value="N/A">N/A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="bloodCategory" className="mb-1 block">Blood Category:</Label>
        <Select value={bloodCategory} onValueChange={onBloodCategoryChange} disabled={!isEditable}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FWB">FWB</SelectItem>
            <SelectItem value="WB">WB</SelectItem>
            <SelectItem value="PC">PC</SelectItem>
            <SelectItem value="FFP">FFP</SelectItem>
            <SelectItem value="PLT">PLT</SelectItem>
            <SelectItem value="MEGAUNIT">MEGAUNIT</SelectItem>
            <SelectItem value="N/A">N/A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="bottleRequired" className="mb-1 block">Bottle Required:</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="bottleRequired" 
            className="h-9 flex-1" 
            type="number" 
            min="0"
            value={bottleRequired}
            onChange={(e) => onBottleRequiredChange?.(parseInt(e.target.value) || 0)}
            disabled={!isEditable} 
          />
          <Select value={bottleUnitType} onValueChange={onBottleUnitTypeChange} disabled={!isEditable}>
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bag">bag</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="N/A">N/A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
