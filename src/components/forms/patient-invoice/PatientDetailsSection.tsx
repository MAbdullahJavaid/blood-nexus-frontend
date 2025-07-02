
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, FileTextIcon } from "lucide-react";

interface PatientDetailsSectionProps {
  patientType: string;
  documentNo: string;
  selectedPatient: any;
  isEditable: boolean;
  isAdding: boolean;
  onPatientTypeChange: (val: string) => void;
  onSearchPatientClick: () => void;
  onSearchDocumentClick: () => void;
  patientName: string;
  setPatientName: (val: string) => void;
  documentDate: string;
  setDocumentDate: (val: string) => void;
  shouldEnableEditing: boolean;
  setDocumentNo: (val: string) => void;
  patientID: string;
  setPatientId: (val: string) => void;
}

export function PatientDetailsSection({
  patientType,
  documentNo,
  selectedPatient,
  isEditable,
  isAdding,
  onPatientTypeChange,
  onSearchPatientClick,
  onSearchDocumentClick,
  patientName,
  setPatientName,
  documentDate,
  setDocumentDate,
  shouldEnableEditing,
  setDocumentNo,
  patientID,
  setPatientId,
}: PatientDetailsSectionProps) {
  return (
    <div className="border rounded-md p-4 bg-green-50 mb-4">
      {/* First row: Type, Patient ID, Patient Name */}
      <div className="grid grid-cols-3 gap-4 items-center mb-2">
        <div>
          <Label htmlFor="patientType" className="mb-1 block">Type:</Label>
          <Select value={patientType} onValueChange={onPatientTypeChange} disabled={!isEditable}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="opd">OPD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="patientId" className="mb-1 block">Patient ID:</Label>
          <div className="flex gap-2">
            <Input
              id="patientId"
              value={patientID}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={!isEditable || !!selectedPatient}
              className="h-8"
              placeholder="Enter Patient ID"
            />
            {isEditable && (
              <button 
                onClick={onSearchPatientClick}
                className="bg-gray-200 ml-1 p-1 rounded hover:bg-gray-300"
                title="Search Patient by Patient ID"
                type="button"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="patientName" className="mb-1 block">Patient Name:</Label>
          <Input
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            disabled={!shouldEnableEditing}
            className="h-8"
          />
        </div>
      </div>
      {/* Second row: Document No, Document Date */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <Label htmlFor="documentNo" className="mb-1 block">Document No:</Label>
          <div className="flex gap-2">
            <Input
              id="documentNo"
              value={documentNo}
              onChange={(e) => setDocumentNo(e.target.value)}
              disabled={true}
              className="h-8 bg-green-100"
              placeholder="(Auto)"
            />
            {isEditable && (
              <button
                onClick={onSearchDocumentClick}
                className="bg-gray-200 ml-1 p-1 rounded hover:bg-gray-300"
                title="Search Document"
                type="button"
              >
                <FileTextIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="documentDate" className="mb-1 block">Document Date:</Label>
          <Input
            id="documentDate"
            type="date"
            className="h-8"
            value={documentDate}
            onChange={(e) => setDocumentDate(e.target.value)}
            disabled={!shouldEnableEditing}
          />
        </div>
      </div>
    </div>
  );
}
