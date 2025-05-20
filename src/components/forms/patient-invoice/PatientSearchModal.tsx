
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Patient } from "./types";
import { mockPatients } from "./mock-data";

interface PatientSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientSelect: (patientId: string) => void;
}

export function PatientSearchModal({ isOpen, onOpenChange, onPatientSelect }: PatientSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPatients = mockPatients.filter(patient => 
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Patient</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="Search by patient ID or name" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="h-64 border mt-2 overflow-y-auto rounded-md">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <div 
                  key={patient.id} 
                  className="p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between"
                  onClick={() => onPatientSelect(patient.id)}
                >
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-600">
                      {patient.gender}, Age: {patient.age}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <div>ID: {patient.id}</div>
                    <div>{patient.hospital}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No patients found</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
