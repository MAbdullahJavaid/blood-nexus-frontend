
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "./types";

interface HospitalDetailsSectionProps {
  selectedPatient: Patient | null;
  isEditable: boolean;
  hospital: string;
  setHospital: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  exDonor: string;
  setExDonor: (value: string) => void;
  shouldEnableEditing: boolean;
}

export function HospitalDetailsSection({
  selectedPatient,
  isEditable,
  hospital,
  setHospital,
  gender,
  setGender,
  exDonor,
  setExDonor,
  shouldEnableEditing
}: HospitalDetailsSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="hospital" className="mb-1 block">Hospital:</Label>
        <Input 
          id="hospital" 
          className="h-9" 
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          disabled={!shouldEnableEditing} 
        />
      </div>
      <div>
        <Label htmlFor="gender" className="mb-1 block">Gender:</Label>
        <Select value={gender} onValueChange={setGender} disabled={!shouldEnableEditing}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="exDonor" className="mb-1 block">Ex-Donor:</Label>
        <Input 
          id="exDonor" 
          className="h-9" 
          value={exDonor}
          onChange={(e) => setExDonor(e.target.value)}
          disabled={!shouldEnableEditing} 
        />
      </div>
    </div>
  );
}
