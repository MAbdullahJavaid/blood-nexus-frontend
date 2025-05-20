
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Patient } from "./types";

interface PatientInfoSectionProps {
  selectedPatient: Patient | null;
  isEditable: boolean;
}

export function PatientInfoSection({
  selectedPatient,
  isEditable
}: PatientInfoSectionProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div>
        <Label htmlFor="phoneNo" className="mb-1 block">Phone No:</Label>
        <Input 
          id="phoneNo" 
          className="h-9" 
          value={selectedPatient?.phoneNo || ""}
          disabled={!isEditable} 
        />
      </div>
      <div>
        <Label htmlFor="age" className="mb-1 block">Age:</Label>
        <Input 
          id="age" 
          className="h-9" 
          type="number" 
          value={selectedPatient?.age || ""}
          disabled={!isEditable} 
        />
      </div>
      <div>
        <Label htmlFor="dob" className="mb-1 block">DOB:</Label>
        <Input id="dob" className="h-9" type="date" disabled={!isEditable} />
      </div>
      <div>
        <Label htmlFor="references" className="mb-1 block">References:</Label>
        <Input id="references" className="h-9" disabled={!isEditable} />
      </div>
    </div>
  );
}
