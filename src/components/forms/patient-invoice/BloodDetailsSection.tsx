
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BloodDetailsSectionProps {
  bloodCategory: string;
  bottleUnitType: string;
  isEditable: boolean;
  onBloodCategoryChange: (value: string) => void;
  onBottleUnitTypeChange: (value: string) => void;
}

export function BloodDetailsSection({
  bloodCategory,
  bottleUnitType,
  isEditable,
  onBloodCategoryChange,
  onBottleUnitTypeChange
}: BloodDetailsSectionProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div>
        <Label htmlFor="bloodGroup" className="mb-1 block">Blood Group:</Label>
        <Select defaultValue="A" disabled={!isEditable}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="AB">AB</SelectItem>
            <SelectItem value="O">O</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="rh" className="mb-1 block">RH:</Label>
        <Select defaultValue="+ve" disabled={!isEditable}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+ve">+ve</SelectItem>
            <SelectItem value="-ve">-ve</SelectItem>
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
            <SelectItem value="PC">PC</SelectItem>
            <SelectItem value="FFP">FFP</SelectItem>
            <SelectItem value="CP">CP</SelectItem>
            <SelectItem value="WB">WB</SelectItem>
            <SelectItem value="Mega Unit">Mega Unit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="bottleRequired" className="mb-1 block">Bottle Required:</Label>
        <div className="flex items-center gap-2">
          <Input id="bottleRequired" className="h-9" type="number" defaultValue="1" disabled={!isEditable} />
          <Select value={bottleUnitType} onValueChange={onBottleUnitTypeChange} disabled={!isEditable}>
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bag">bag</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
