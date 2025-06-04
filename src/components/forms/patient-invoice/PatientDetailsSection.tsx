
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
  setDocumentNo?: (value: string) => void;
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
      {/* Patient Type */}
      <div className="space-y-2">
        <Label htmlFor="patientType">Patient Type</Label>
        <Select 
          value={patientType} 
          onValueChange={onPatientTypeChange}
          disabled={!isEditable}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="opd">OPD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Document Number */}
      <div className="space-y-2">
        <Label htmlFor="documentNo">Document No</Label>
        <div className="flex gap-2">
          <Input
            id="documentNo"
            value={documentNo}
            onChange={(e) => setDocumentNo?.(e.target.value)}
            disabled={!isEditable || isAdding}
            placeholder="Auto-generated"
          />
          {!isAdding && (
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={onSearchDocumentClick}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Document Date */}
      <div className="space-y-2">
        <Label htmlFor="documentDate">Date</Label>
        <Input
          id="documentDate"
          type="date"
          value={documentDate}
          onChange={(e) => setDocumentDate(e.target.value)}
          disabled={!isEditable}
        />
      </div>

      {/* Patient ID */}
      <div className="space-y-2">
        <Label htmlFor="patientId">Patient ID</Label>
        <div className="flex gap-2">
          <Input
            id="patientId"
            value={patientID}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={patientType === "regular" || !shouldEnableEditing}
            placeholder={patientType === "regular" ? "Select patient first" : "Enter Patient ID"}
          />
          {patientType === "regular" && (
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={onSearchPatientClick}
              disabled={!isEditable}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Patient Name */}
      <div className="space-y-2">
        <Label htmlFor="patientName">Patient Name</Label>
        <Input
          id="patientName"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          disabled={patientType === "regular" || !shouldEnableEditing}
          placeholder={patientType === "regular" ? "Select patient first" : "Enter Patient Name"}
        />
      </div>
    </div>
  );
}
