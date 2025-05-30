
import { ForwardedRef } from "react";

export interface PatientInvoiceFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

export interface FormRefObject {
  handleAddItem?: () => void;
  handleDeleteItem?: () => void;
  handleSave?: () => Promise<{success: boolean, invoiceId?: string, error?: any}>;
}

export interface Patient {
  id: string;
  patient_id?: string;
  name: string;
  hospital: string;
  gender: string;
  phoneNo: string;
  phone?: string;
  age: number;
  date_of_birth?: string;
  blood_group?: string;
}

export interface InvoiceItem {
  id: string;
  testId: number;
  testName: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  documentNo: string;
  patientId: string;
  patientName: string;
  date: string;
  amount: number;
}

export interface Test {
  id: number;
  name: string;
  rate: number;
}

export interface PatientInvoiceRecord {
  id: string;
  invoice_number: string;
  invoice_date: string;
  patient_name: string;
  patient_phone: string;
  patient_age: number;
  patient_dob: string;
  patient_gender: string;
  hospital_name: string;
  blood_group_type: string;
  rh_type: string;
  blood_category: string;
  bottle_required: number;
  bottle_unit_type: string;
  ex_donor: string;
  patient_references: string;
}
