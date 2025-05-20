
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "./types";

interface HospitalDetailsSectionProps {
  selectedPatient: Patient | null;
  isEditable: boolean;
}

export function HospitalDetailsSection({
  selectedPatient,
  isEditable
}: HospitalDetailsSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="hospital" className="mb-1 block">Hospital Name:</Label>
        <Input 
          id="hospital" 
          className="h-9" 
          value={selectedPatient?.hospital || ""}
          disabled={!isEditable} 
        />
      </div>
      <div>
        <Label htmlFor="gender" className="mb-1 block">Gender:</Label>
        <Select defaultValue={selectedPatient?.gender || "male"} disabled={!isEditable}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="exDonor" className="mb-1 block">EX / Donor:</Label>
        <Input id="exDonor" className="h-9" disabled={!isEditable} />
      </div>
    </div>
  );
}
