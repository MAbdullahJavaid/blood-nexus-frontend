
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Patient, InvoiceItem } from "../types";

export const useSaveInvoice = () => {
  const handleSave = async (
    patientType: string,
    regularPatient: Patient | null,
    opdPatientData: any,
    documentNo: string,
    documentDate: string,
    totalAmount: number,
    bloodGroup: string,
    rhType: string,
    bloodCategory: string,
    bottleRequired: number,
    bottleUnitType: string,
    exDonor: string,
    references: string,
    discount: number,
    receivedAmount: number,
    items: InvoiceItem[],
    setLoading: (loading: boolean) => void
  ) => {
    try {
      setLoading(true);
      
      let patientId: string;
      
      const getCurrentPatientData = () => {
        if (patientType === "regular" && regularPatient) {
          return {
            patientId: regularPatient.patient_id || regularPatient.id,
            name: regularPatient.name,
            phone: regularPatient.phone || "",
            age: regularPatient.age,
            dob: regularPatient.date_of_birth || "",
            hospital: regularPatient.hospital || "",
            gender: regularPatient.gender || "male"
          };
        } else if (patientType === "opd") {
          return opdPatientData;
        }
        return {
          patientId: "",
          name: "",
          phone: "",
          age: null,
          dob: "",
          hospital: "",
          gender: "male"
        };
      };

      const currentData = getCurrentPatientData();
      
      if (patientType === "opd") {
        const bloodGroupMap: { [key: string]: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" } = {
          "A": "A+",
          "B": "B+", 
          "AB": "AB+",
          "O": "O+",
          "N/A": "O+"
        };
        
        const mappedBloodGroup = bloodGroupMap[opdPatientData.bloodGroup] || "O+";
        
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .insert({
            patient_id: opdPatientData.patientId,
            name: opdPatientData.name,
            phone: opdPatientData.phone,
            date_of_birth: opdPatientData.dob || null,
            gender: opdPatientData.gender,
            blood_group: mappedBloodGroup,
            hospital: opdPatientData.hospital,
            age: opdPatientData.age
          })
          .select('id')
          .single();
          
        if (patientError) throw patientError;
        patientId = patientData.id;
      } else {
        if (!regularPatient?.id) {
          throw new Error("No patient selected");
        }
        patientId = regularPatient.id;
      }
      
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('patient_invoices')
        .insert({
          document_no: documentNo,
          document_date: documentDate,
          patient_id: patientId,
          total_amount: totalAmount,
          patient_type: patientType,
          blood_group_separate: bloodGroup,
          rh_factor: rhType,
          blood_category: bloodCategory,
          bottle_quantity: bottleRequired,
          bottle_unit: bottleUnitType,
          ex_donor: exDonor,
          reference_notes: references,
          hospital_name: currentData.hospital,
          age: currentData.age,
          dob: currentData.dob || null,
          phone_no: currentData.phone,
          gender: currentData.gender,
          discount_amount: discount,
          amount_received: receivedAmount,
          patient_name: currentData.name
        })
        .select('id')
        .single();
        
      if (invoiceError) throw invoiceError;
      
      // Create invoice items with type and category
      if (items.length > 0) {
        const invoiceItems = items.map(item => ({
          invoice_id: invoiceData.id,
          test_id: item.testId || null,
          test_name: item.testName,
          quantity: item.qty,
          unit_price: item.rate,
          total_price: item.amount,
          type: item.type,
          category: item.category
        }));
        
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(invoiceItems);
          
        if (itemsError) throw itemsError;
      }
      
      toast.success("Invoice saved successfully");
      return { success: true, invoiceId: invoiceData.id };
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { handleSave };
};
