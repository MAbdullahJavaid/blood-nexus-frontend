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
  blood_group_separate?: string; // Added for new separate field
  rh_factor?: string; // Added for new separate field
}

export interface InvoiceItem {
  id: string;
  testId: number;
  testName: string;
  qty: number;
  rate: number;
  amount: number;
  type?: string;
  category?: string;
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
