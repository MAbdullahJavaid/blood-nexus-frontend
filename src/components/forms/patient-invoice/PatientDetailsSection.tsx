
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Patient } from "./types";

interface PatientDetailsSectionProps {
  patientType: string;
  documentNo: string;
  selectedPatient: Patient | null;
  isEditable: boolean;
  isAdding: boolean;
  onPatientTypeChange: (value: string) => void;
  onSearchPatientClick: () => void;
  onSearchDocumentClick: () => void;
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
}: PatientDetailsSectionProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="type" className="mb-1 block">Type:</Label>
          <Select 
            value={patientType} 
            onValueChange={onPatientTypeChange}
            disabled={!isEditable}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="opd">OPD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="patientId" className="mb-1 block">Patient ID:</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="patientId" 
              className="h-9" 
              value={selectedPatient?.id || ""}
              maxLength={patientType === "opd" ? 11 : undefined} 
              disabled={!isEditable} 
            />
            {/* Show search icon when adding a regular patient */}
            {isEditable && isAdding && patientType === "regular" && (
              <button 
                onClick={onSearchPatientClick}
                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                aria-label="Search patient"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="documentNo" className="mb-1 block">Document No:</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="documentNo" 
              className="h-9" 
              value={documentNo} 
              disabled={true} 
            />
            {/* Show search icon when editing (not adding) */}
            {isEditable && !isAdding && (
              <button 
                onClick={onSearchDocumentClick}
                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                aria-label="Search document"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="name" className="mb-1 block">Patient Name:</Label>
          <Input 
            id="name" 
            className="h-9" 
            value={selectedPatient?.name || ""}
            disabled={!isEditable} 
          />
        </div>
        <div>
          <Label htmlFor="documentDate" className="mb-1 block">Document Date:</Label>
          <Input 
            id="documentDate" 
            className="h-9" 
            type="date" 
            defaultValue={new Date().toISOString().split('T')[0]} 
            disabled={!isEditable} 
          />
        </div>
      </div>
    </>
  );
}
