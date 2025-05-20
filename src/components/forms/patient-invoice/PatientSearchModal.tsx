
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Patient } from "./types";
import { mockPatients } from "./mock-data";

interface PatientSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientSelect: (patientId: string) => void;
}

export function PatientSearchModal({ isOpen, onOpenChange, onPatientSelect }: PatientSearchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Patient</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input placeholder="Enter patient ID or name" />
          <div className="h-64 border mt-4 overflow-y-auto">
            {mockPatients.map(patient => (
              <div 
                key={patient.id} 
                className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => onPatientSelect(patient.id)}
              >
                <div className="font-medium">{patient.name}</div>
                <div className="text-sm text-gray-600">
                  ID: {patient.id}, Hospital: {patient.hospital}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
