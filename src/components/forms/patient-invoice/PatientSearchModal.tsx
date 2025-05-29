
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Patient {
  id: string;
  patient_id: string;
  name: string;
  phone?: string;
  gender?: string;
  age?: number;
  hospital?: string;
  blood_group?: string;
}

interface PatientSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientSelect: (patient: Patient) => void;
}

export function PatientSearchModal({ isOpen, onOpenChange, onPatientSelect }: PatientSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Load all patients when modal opens
  const loadAllPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('id, patient_id, name, phone, gender, age, hospital, blood_group')
        .order('name', { ascending: true });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error loading patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  // Search patients
  const searchPatients = async () => {
    if (!searchTerm.trim()) {
      await loadAllPatients();
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('id, patient_id, name, phone, gender, age, hospital, blood_group')
        .or(`name.ilike.%${searchTerm}%,patient_id.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order('name', { ascending: true })
        .limit(20);

      if (error) throw error;
      setPatients(data || []);
      
      if (data && data.length === 0) {
        toast.info("No patients found matching your search");
      }
    } catch (error) {
      console.error("Error searching patients:", error);
      toast.error("Failed to search patients");
    } finally {
      setLoading(false);
    }
  };

  // Load patients when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      loadAllPatients();
    }
  }, [isOpen]);

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Search Patient</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Search by patient ID, name, or phone" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchPatients()}
              className="flex-1"
            />
            <Button onClick={searchPatients} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading patients...</div>
            ) : patients.length > 0 ? (
              <div className="divide-y">
                {patients.map((patient) => (
                  <div 
                    key={patient.id} 
                    className="p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-600">
                          {patient.gender && `${patient.gender}, `}
                          {patient.age && `Age: ${patient.age}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          Phone: {patient.phone || 'N/A'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 text-right">
                        <div className="font-medium">ID: {patient.patient_id}</div>
                        <div>Blood: {patient.blood_group || 'N/A'}</div>
                        <div className="text-xs">{patient.hospital || 'No hospital'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? "No patients found" : "Enter search terms or browse all patients"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
