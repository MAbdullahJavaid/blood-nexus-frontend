
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PreCrossmatchData } from "./types";

interface PatientInfoSectionProps {
  selectedInvoice: PreCrossmatchData | null;
  bloodCategory: string;
  setBloodCategory: (value: string) => void;
  isEditable: boolean;
}

export const PatientInfoSection = ({
  selectedInvoice,
  bloodCategory,
  setBloodCategory,
  isEditable
}: PatientInfoSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="patientName" className="mb-1 block">Patient Name:</Label>
          <Input 
            id="patientName" 
            className="h-9" 
            disabled={true} 
            value={selectedInvoice?.patient_name || ""}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="age" className="mb-1 block">Age:</Label>
            <Input 
              id="age" 
              className="h-9" 
              disabled={true} 
              value={selectedInvoice?.age || ""}
            />
          </div>
          <div>
            <Label htmlFor="sex" className="mb-1 block">Sex:</Label>
            <Input 
              id="sex" 
              className="h-9" 
              disabled={true} 
              value={selectedInvoice?.sex || ""}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="patientBloodGroup" className="mb-1 block">Patient Blood Group:</Label>
          <div className="flex gap-2">
            <Select disabled={true} value={selectedInvoice?.blood_group || "A"}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="O">O</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
              </SelectContent>
            </Select>
            <Select disabled={true} value={selectedInvoice?.rh || "+ve"}>
              <SelectTrigger className="h-9 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+ve">+ve</SelectItem>
                <SelectItem value="-ve">-ve</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="hospital" className="mb-1 block">Hospital:</Label>
          <Input 
            id="hospital" 
            className="h-9" 
            disabled={true}
            value={selectedInvoice?.hospital || ""}
          />
        </div>
        <div>
          <Label htmlFor="bloodCate" className="mb-1 block">Blood Category:</Label>
          <Input 
            id="bloodCate" 
            className="h-9" 
            value={bloodCategory}
            onChange={(e) => setBloodCategory(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>
    </>
  );
};
