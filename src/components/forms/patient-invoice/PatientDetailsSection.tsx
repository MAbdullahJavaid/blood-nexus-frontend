
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { Patient } from "./types";

interface PatientDetailsSectionProps {
  patientType: string;
  documentNo: string;
  selectedPatient: Patient | null;
  isEditable: boolean;
  isAdding: boolean;
  patientID: string;
  setPatientId: (value: string) => void;
  onPatientTypeChange: (value: string) => void;
  onSearchPatientClick: () => void;
  onSearchDocumentClick: () => void;
  patientName: string;
  setPatientName: (value: string) => void;
  documentDate: string;
  setDocumentDate: (value: string) => void;
  shouldEnableEditing: boolean;
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
  patientID,
  setPatientId,
}: PatientDetailsSectionProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="type" className="mb-1 block">
            Type:
          </Label>
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
          <Label htmlFor="patientId" className="mb-1 block">
            Patient ID:
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="patientId"
              className="h-9"
              value={patientType === "opd" ? patientID : (selectedPatient?.id || "")}
              maxLength={11}
              disabled={patientType === "regular" || !isEditable}
              onChange={(e) => {
                if (patientType === "opd") {
                  setPatientId(e.target.value);
                }
              }}
            />
            {isEditable && patientType === "regular" && (
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
          <Label htmlFor="documentNo" className="mb-1 block">
            Document No:
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="documentNo"
              className="h-9"
              value={documentNo}
              disabled={true}
            />
            {(isEditable || !isAdding) && (
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
          <Label htmlFor="name" className="mb-1 block">
            Patient Name:
          </Label>
          <Input
            id="name"
            className="h-9"
            value={
              patientType === "regular"
                ? selectedPatient?.name || ""
                : patientName
            }
            onChange={(e) =>
              patientType === "opd" && setPatientName(e.target.value)
            }
            disabled={patientType === "regular" && !!selectedPatient}
          />
        </div>
        <div>
          <Label htmlFor="documentDate" className="mb-1 block">
            Document Date:
          </Label>
          <Input
            id="documentDate"
            className="h-9"
            type="date"
            value={documentDate}
            onChange={(e) => setDocumentDate(e.target.value)}
            disabled={!isEditable}
          />
        </div>
      </div>
    </>
  );
}
