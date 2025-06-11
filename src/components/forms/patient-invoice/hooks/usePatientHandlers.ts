
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "../types";

export const usePatientHandlers = (
  patientType: string,
  setRegularPatient: (patient: Patient | null) => void,
  setBloodGroup: (value: string) => void,
  setRhType: (value: string) => void,
  setIsSearchModalOpen: (open: boolean) => void,
  opdPatientData: any,
  setOpdPatientData: (data: any) => void
) => {
  const handlePatientTypeChange = (value: string) => {
    console.log("Patient type changed to:", value);
    
    // Clear both patient states when type changes
    setRegularPatient(null);
    setOpdPatientData({
      patientId: "",
      name: "",
      phone: "",
      age: null,
      dob: "",
      hospital: "",
      gender: "male",
      bloodGroup: "N/A",
      rhType: "N/A"
    });
    
    setBloodGroup("N/A");
    setRhType("N/A");
    
    console.log("Patient data cleared for type change");
  };

  const handlePatientSelect = async (patientId: string) => {
    try {
      console.log("=== PATIENT SELECTION STARTED ===");
      console.log("Patient ID received:", patientId);
      
      const { data: dbPatient, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      
      console.log("Database query result:", { dbPatient, error });
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      if (dbPatient) {
        console.log("Setting regular patient data:", dbPatient);
        
        // Map database patient to Patient interface format
        const patient: Patient = {
          id: dbPatient.id,
          patient_id: dbPatient.patient_id,
          name: dbPatient.name,
          hospital: dbPatient.hospital || "",
          gender: dbPatient.gender || "male",
          phoneNo: dbPatient.phone || "", // Map phone to phoneNo
          phone: dbPatient.phone || "", // Keep both for compatibility
          age: dbPatient.age || 0,
          date_of_birth: dbPatient.date_of_birth || "",
          blood_group: dbPatient.blood_group || "O+"
        };
        
        // Set the regular patient object
        setRegularPatient(patient);
        
        // Handle blood group parsing for regular patients
        if (dbPatient.blood_group) {
          const bloodGroupStr = dbPatient.blood_group;
          console.log("Processing blood group:", bloodGroupStr);
          
          if (bloodGroupStr.includes('+')) {
            const group = bloodGroupStr.replace('+', '');
            setBloodGroup(group);
            setRhType('+ve');
            console.log("Set blood group:", group, "+ve");
          } else if (bloodGroupStr.includes('-')) {
            const group = bloodGroupStr.replace('-', '');
            setBloodGroup(group);
            setRhType('-ve');
            console.log("Set blood group:", group, "-ve");
          } else {
            setBloodGroup(bloodGroupStr);
            setRhType('N/A');
            console.log("Set blood group:", bloodGroupStr, "N/A");
          }
        } else {
          setBloodGroup("N/A");
          setRhType("N/A");
        }
        
        console.log("=== REGULAR PATIENT DATA LOADED SUCCESSFULLY ===");
        toast.success(`Patient ${patient.name} loaded successfully`);
      } else {
        console.warn("No patient data returned from database");
        toast.error("No patient data found");
      }
      
      setIsSearchModalOpen(false);
      
    } catch (error) {
      console.error("=== ERROR IN PATIENT SELECTION ===");
      console.error("Error details:", error);
      toast.error("Failed to load patient data");
      setIsSearchModalOpen(false);
    }
  };

  const handleOpdPatientChange = (field: string, value: any) => {
    setOpdPatientData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    
    // Update blood group states if blood group fields change
    if (field === 'bloodGroup') {
      setBloodGroup(value);
    } else if (field === 'rhType') {
      setRhType(value);
    }
  };

  return {
    handlePatientTypeChange,
    handlePatientSelect,
    handleOpdPatientChange
  };
};
