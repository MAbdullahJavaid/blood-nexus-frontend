
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PatientInfoSectionProps = {
  selectedReport: any | null;
  formatDate: (d: string | null) => string;
  formatDateTime: (d: string | null) => string;
};

const PatientInfoSection = ({ selectedReport, formatDate, formatDateTime }: PatientInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* First Column */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="documentNo" className="text-sm font-medium">
            Document No:
          </Label>
          <Input id="documentNo" value={selectedReport?.document_no || ""} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="patientName" className="text-sm font-medium">
            Patient Name:
          </Label>
          <Input id="patientName" value={selectedReport?.patient_name || ""} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="hospitalName" className="text-sm font-medium">
            Hospital Name:
          </Label>
          <Input id="hospitalName" value={selectedReport?.hospital_name || ""} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="phoneNo" className="text-sm font-medium">
            Phone No:
          </Label>
          <Input id="phoneNo" value={selectedReport?.phone || ""} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="bloodGroup" className="text-sm font-medium">
            Blood Group:
          </Label>
          <Input id="bloodGroup" value={selectedReport?.blood_group || ""} readOnly className="bg-gray-50" />
        </div>
      </div>

      {/* Second Column */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="patientId" className="text-sm font-medium">
            Patient ID:
          </Label>
          <Input id="patientId" value={selectedReport?.patient_id || ""} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="type" className="text-sm font-medium">
            Type:
          </Label>
          <Select disabled>
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder={selectedReport?.type || "Regular"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="opd">OPD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gender" className="text-sm font-medium">
            Gender:
          </Label>
          <Select disabled>
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder={selectedReport?.gender || "Male"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="age" className="text-sm font-medium">
            Age:
          </Label>
          <Input id="age" value={selectedReport?.age || ""} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="rh" className="text-sm font-medium">
            RH:
          </Label>
          <Input id="rh" value={selectedReport?.rh || ""} readOnly className="bg-gray-50" />
        </div>
      </div>

      {/* Third Column */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="documentDate" className="text-sm font-medium">
            Document Date:
          </Label>
          <Input id="documentDate" value={formatDate(selectedReport?.created_at)} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="registrationDate" className="text-sm font-medium">
            Registration Date:
          </Label>
          <Input id="registrationDate" value={formatDateTime(selectedReport?.registration_date)} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="dob" className="text-sm font-medium">
            DOB:
          </Label>
          <Input id="dob" value={formatDate(selectedReport?.dob)} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="references" className="text-sm font-medium">
            References:
          </Label>
          <Input id="references" value={selectedReport?.reference || ""} readOnly className="bg-gray-50" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="bloodCategory" className="text-sm font-medium">
              Blood Category:
            </Label>
            <Input id="bloodCategory" value={selectedReport?.blood_category || ""} readOnly className="bg-gray-50" />
          </div>
          <div>
            <Label htmlFor="bottleRequired" className="text-sm font-medium">
              Bottle Required:
            </Label>
            <div className="flex gap-1">
              <Input id="bottleRequired" value={selectedReport?.bottle_required || ""} readOnly className="bg-gray-50" />
              <span className="text-sm text-gray-600 flex items-center">bag</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;
