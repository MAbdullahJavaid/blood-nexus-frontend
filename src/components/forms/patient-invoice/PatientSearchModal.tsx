
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PatientSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientSelect: (patientId: string) => void;
}

export function PatientSearchModal({ isOpen, onOpenChange, onPatientSelect }: PatientSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all patients when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAllPatients();
    }
  }, [isOpen]);

  // Filter patients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(allPatients);
    } else {
      const filtered = allPatients.filter(patient => 
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, allPatients]);

  const loadAllPatients = async () => {
    try {
      setLoading(true);
      console.log("Loading all patients...");
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name', { ascending: true });

      console.log("Patients loaded:", data);
      console.log("Load error:", error);

      if (error) throw error;
      
      setAllPatients(data || []);
      setFilteredPatients(data || []);
      
      if (!data || data.length === 0) {
        toast.info("No patients found in database");
      }
    } catch (error) {
      console.error("Error loading patients:", error);
      toast.error("Failed to load patients");
      setAllPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient: any) => {
    console.log("Selected patient:", patient);
    onPatientSelect(patient.id);
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Search Patient</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="Search by patient name, ID, or phone number" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="h-96 border rounded-lg overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading patients...</div>
            ) : filteredPatients.length > 0 ? (
              <div className="divide-y">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-600">
                      ID: {patient.patient_id} | Phone: {patient.phone || 'N/A'} | 
                      Blood Group: {patient.blood_group} | Hospital: {patient.hospital || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Age: {patient.age || 'N/A'} | Gender: {patient.gender || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? "No patients found matching your search" : "No patients available"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
