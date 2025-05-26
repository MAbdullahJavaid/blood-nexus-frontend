
import { useState } from "react";
import { InvoiceItem } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SaveParams {
  documentNo: string;
  documentDate: string;
  patientType: string;
  patientName: string;
  phoneNo: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  hospital: string;
  age: number | null;
  selectedPatient: any;
  totalAmount: number;
  rhType: string;
  bloodCategory: string;
  bottleRequired: number;
  bottleUnitType: string;
  exDonor: string;
  references: string;
  discount: number;
  receivedAmount: number;
  items: InvoiceItem[];
}

export function useInvoiceSave() {
  const [loading, setLoading] = useState(false);

  const handleSave = async (params: SaveParams) => {
    try {
      setLoading(true);
      
      let patientId: string;
      
      if (params.patientType === "opd") {
        const bloodGroupMap: { [key: string]: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" } = {
          "A": "A+",
          "B": "B+", 
          "AB": "AB+",
          "O": "O+",
          "N/A": "O+"
        };
        
        const mappedBloodGroup = bloodGroupMap[params.bloodGroup] || "O+";
        const patientIdNumber = `P${Date.now()}`;
        
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .insert({
            patient_id: patientIdNumber,
            name: params.patientName,
            phone: params.phoneNo,
            date_of_birth: params.dob || null,
            gender: params.gender,
            blood_group: mappedBloodGroup,
            hospital: params.hospital,
            age: params.age
          })
          .select('id')
          .single();
          
        if (patientError) throw patientError;
        patientId = patientData.id;
      } else {
        if (!params.selectedPatient?.id) {
          throw new Error("No patient selected");
        }
        patientId = params.selectedPatient.id;
      }
      
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('patient_invoices')
        .insert({
          invoice_number: params.documentNo,
          invoice_date: params.documentDate,
          patient_id: patientId,
          patient_name: params.patientName,
          total_amount: params.totalAmount,
          patient_type: params.patientType,
          blood_group_type: params.bloodGroup,
          rh_type: params.rhType,
          blood_category: params.bloodCategory,
          bottle_required: params.bottleRequired,
          bottle_unit_type: params.bottleUnitType,
          ex_donor: params.exDonor,
          patient_references: params.references,
          hospital_name: params.hospital,
          patient_age: params.age,
          patient_dob: params.dob || null,
          patient_phone: params.phoneNo,
          patient_gender: params.gender,
          discount_amount: params.discount,
          amount_received: params.receivedAmount,
          status: params.receivedAmount >= params.totalAmount ? "Paid" : "Pending"
        })
        .select('id')
        .single();
        
      if (invoiceError) throw invoiceError;
      
      const invoiceItems = params.items.map(item => ({
        invoice_id: invoiceData.id,
        item_id: item.testId.toString(),
        item_type: "test",
        quantity: item.qty,
        unit_price: item.rate,
        total_price: item.amount
      }));
      
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);
        
      if (itemsError) throw itemsError;
      
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

  return {
    loading,
    handleSave
  };
}
