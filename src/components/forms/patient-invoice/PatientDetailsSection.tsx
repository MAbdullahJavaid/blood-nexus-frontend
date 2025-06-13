
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileSearch } from "lucide-react";

interface PatientDetailsSectionProps {
  patientType: string;
  documentNo: string;
  selectedPatient: any;
  isEditable: boolean;
  isAdding: boolean;
  onPatientTypeChange: (value: string) => void;
  onSearchPatientClick: () => void;
  onSearchDocumentClick: () => void;
  patientName: string;
  setPatientName: (value: string) => void;
  documentDate: string;
  setDocumentDate: (value: string) => void;
  shouldEnableEditing: boolean;
  setDocumentNo: (value: string) => void;
  patientID: string;
  setPatientId: (value: string) => void;
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
  setPatientId
}: PatientDetailsSectionProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <div>
        <Label htmlFor="patientType" className="mb-1 block">Patient Type:</Label>
        <Select value={patientType} onValueChange={onPatientTypeChange} disabled={!isEditable}>
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
        <Label htmlFor="documentNo" className="mb-1 block">Document No:</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="documentNo" 
            className="h-9 flex-1" 
            value={documentNo}
            readOnly={true}
            placeholder="Auto-generated"
          />
          {isEditable && (
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              className="h-9 px-2"
              onClick={onSearchDocumentClick}
            >
              <FileSearch className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="patientName" className="mb-1 block">Patient Name:</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="patientName" 
            className="h-9 flex-1" 
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            disabled={!shouldEnableEditing} 
          />
          {patientType === "regular" && isEditable && (
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              className="h-9 px-2"
              onClick={onSearchPatientClick}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="documentDate" className="mb-1 block">Date:</Label>
        <Input 
          id="documentDate" 
          className="h-9" 
          type="date" 
          value={documentDate}
          onChange={(e) => setDocumentDate(e.target.value)}
          disabled={!isEditable} 
        />
      </div>
      {patientType === "opd" && (
        <div className="col-span-4">
          <Label htmlFor="patientId" className="mb-1 block">Patient ID:</Label>
          <Input 
            id="patientId" 
            className="h-9" 
            value={patientID}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={!shouldEnableEditing}
            placeholder="Enter patient ID"
          />
        </div>
      )}
    </div>
  );
}
