
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
      
      let finalPatientId: string;
      
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
        // For OPD patients, simply use the manually entered patient ID
        finalPatientId = currentData.patientId;
      } else {
        // For regular patients, use the patient_id from the selected patient
        if (!regularPatient) {
          throw new Error("No patient selected");
        }
        finalPatientId = regularPatient.patient_id || regularPatient.id;
      }
      
      // Ensure numeric values are properly bounded for database
      const safeTotalAmount = Math.min(Math.max(totalAmount || 0, 0), 2147483647);
      const safeDiscount = Math.min(Math.max(discount || 0, 0), 2147483647);
      const safeReceivedAmount = Math.min(Math.max(receivedAmount || 0, 0), 2147483647);
      const safeBottleRequired = Math.min(Math.max(bottleRequired || 0, 0), 32767);
      const safeAge = currentData.age ? Math.min(Math.max(currentData.age, 0), 32767) : null;
      
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('patient_invoices')
        .insert({
          document_no: documentNo,
          document_date: documentDate,
          patient_id: finalPatientId, // Simply use the patient ID directly
          total_amount: safeTotalAmount,
          patient_type: patientType,
          blood_group_separate: bloodGroup,
          rh_factor: rhType,
          blood_category: bloodCategory,
          bottle_quantity: safeBottleRequired,
          bottle_unit: bottleUnitType,
          ex_donor: exDonor,
          reference_notes: references,
          hospital_name: currentData.hospital,
          age: safeAge,
          dob: currentData.dob || null,
          phone_no: currentData.phone,
          gender: currentData.gender,
          discount_amount: safeDiscount,
          amount_received: safeReceivedAmount,
          patient_name: currentData.name
        })
        .select('id')
        .single();
        
      if (invoiceError) throw invoiceError;
      
      // Create invoice items with safe numeric values
      if (items.length > 0) {
        const invoiceItems = items.map(item => ({
          invoice_id: invoiceData.id,
          test_id: item.testId || null,
          test_name: item.testName,
          quantity: Math.min(Math.max(item.qty || 1, 1), 32767),
          unit_price: Math.min(Math.max(item.rate || 0, 0), 999999.99),
          total_price: Math.min(Math.max(item.amount || 0, 0), 999999.99),
          type: item.type ?? null,
          category: item.category ?? null
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
