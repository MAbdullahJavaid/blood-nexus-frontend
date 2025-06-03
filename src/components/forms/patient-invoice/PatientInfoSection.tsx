
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Patient } from "./types";

interface PatientInfoSectionProps {
  selectedPatient: Patient | null;
  isEditable: boolean;
  phoneNo: string;
  setPhoneNo: (value: string) => void;
  age: number | null;
  setAge: (value: number | null) => void;
  dob: string;
  setDob: (value: string) => void;
  references: string;
  setReferences: (value: string) => void;
  shouldEnableEditing: boolean;
}

export function PatientInfoSection({
  selectedPatient,
  isEditable,
  phoneNo,
  setPhoneNo,
  age,
  setAge,
  dob,
  setDob,
  references,
  setReferences,
  shouldEnableEditing
}: PatientInfoSectionProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div>
        <Label htmlFor="phoneNo" className="mb-1 block">Phone No:</Label>
        <Input 
          id="phoneNo" 
          className="h-9" 
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          disabled={!shouldEnableEditing} 
        />
      </div>
      <div>
        <Label htmlFor="age" className="mb-1 block">Age:</Label>
        <Input 
          id="age" 
          className="h-9" 
          type="number" 
          value={age === null ? "" : age}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : null;
            setAge(value);
          }}
          disabled={!shouldEnableEditing} 
        />
      </div>
      <div>
        <Label htmlFor="dob" className="mb-1 block">DOB:</Label>
        <Input 
          id="dob" 
          className="h-9" 
          type="date" 
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          disabled={!shouldEnableEditing} 
        />
      </div>
      <div>
        <Label htmlFor="references" className="mb-1 block">References:</Label>
        <Input 
          id="references" 
          className="h-9" 
          value={references}
          onChange={(e) => setReferences(e.target.value)}
          disabled={!shouldEnableEditing} 
        />
      </div>
    </div>
  );
}
