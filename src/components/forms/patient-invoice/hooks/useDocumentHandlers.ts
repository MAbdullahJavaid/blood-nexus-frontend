
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Patient, InvoiceItem } from "../types";

export const useDocumentHandlers = (
  setDocumentNo: (docNo: string) => void,
  setDocumentDate: (date: string) => void,
  setTotalAmount: (amount: number) => void,
  setDiscount: (discount: number) => void,
  setReceivedAmount: (amount: number) => void,
  setReferences: (refs: string) => void,
  setExDonor: (donor: string) => void,
  setPatientType: (type: string) => void,
  setBloodGroup: (bg: string) => void,
  setRhType: (rh: string) => void,
  setBloodCategory: (category: string) => void,
  setBottleRequired: (bottles: number) => void,
  setBottleUnitType: (unit: string) => void,
  setRegularPatient: (patient: Patient | null) => void,
  setOpdPatientData: (data: any) => void,
  setItems: (items: InvoiceItem[]) => void,
  setIsDocumentSearchModalOpen: (open: boolean) => void
) => {
  const generateDocumentNo = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_invoice_number');
      if (error) throw error;
      setDocumentNo(data);
    } catch (error) {
      console.error('Error generating document number:', error);
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const sequence = "0001";
      setDocumentNo(`${year}${month}${sequence}`);
    }
  };

  const handleDocumentSelect = async (docNum: string) => {
    try {
      // Load invoice data from patient_invoices table
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('patient_invoices')
        .select('*')
        .eq('document_no', docNum)
        .single();

      if (invoiceError) throw invoiceError;

      if (invoiceData) {
        setDocumentNo(invoiceData.document_no);
        setDocumentDate(invoiceData.document_date);
        setTotalAmount(invoiceData.total_amount || 0);
        setDiscount(invoiceData.discount_amount || 0);
        setReceivedAmount(invoiceData.amount_received || 0);
        setReferences(invoiceData.reference_notes || "");
        setExDonor(invoiceData.ex_donor || "");
        setPatientType(invoiceData.patient_type || "regular");
        
        // Set blood details
        setBloodGroup(invoiceData.blood_group_separate || "N/A");
        setRhType(invoiceData.rh_factor || "N/A");
        setBloodCategory(invoiceData.blood_category || "FWB");
        setBottleRequired(invoiceData.bottle_quantity || 1);
        setBottleUnitType(invoiceData.bottle_unit || "bag");

        // Load patient data based on type
        if (invoiceData.patient_type === "regular" && invoiceData.patient_id) {
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('*')
            .eq('id', invoiceData.patient_id)
            .single();

          if (!patientError && patientData) {
            const patient: Patient = {
              id: patientData.id,
              patient_id: patientData.patient_id,
              name: patientData.name,
              hospital: patientData.hospital || "",
              gender: patientData.gender || "male",
              phoneNo: patientData.phone || "",
              phone: patientData.phone || "",
              age: patientData.age || 0,
              date_of_birth: patientData.date_of_birth || "",
              blood_group: patientData.blood_group || "O+"
            };
            setRegularPatient(patient);
          }
        } else if (invoiceData.patient_type === "opd") {
          // For OPD, use invoice data directly
          setOpdPatientData({
            patientId: invoiceData.patient_id || "",
            name: invoiceData.patient_name || "",
            phone: invoiceData.phone_no || "",
            age: invoiceData.age || null,
            dob: invoiceData.dob || "",
            hospital: invoiceData.hospital_name || "",
            gender: invoiceData.gender || "male",
            bloodGroup: invoiceData.blood_group_separate || "N/A",
            rhType: invoiceData.rh_factor || "N/A"
          });
        }

        // Load invoice items with type and category
        const { data: itemsData, error: itemsError } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoiceData.id);

        if (!itemsError && itemsData) {
          const invoiceItems: InvoiceItem[] = itemsData.map((item) => ({
            id: item.id,
            testId: item.test_id || 0,
            testName: item.test_name,
            qty: item.quantity,
            rate: item.unit_price,
            amount: item.total_price,
            type: item.type,
            category: item.category
          }));
          setItems(invoiceItems);
        }

        toast.success("Invoice loaded successfully");
      }
    } catch (error) {
      console.error("Error loading invoice:", error);
      toast.error("Failed to load invoice");
    }
    
    setIsDocumentSearchModalOpen(false);
  };

  return {
    generateDocumentNo,
    handleDocumentSelect
  };
};
