
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
  patient_id: string; // Added this property
  name: string;
  hospital: string;
  gender: string;
  phoneNo: string;
  age: number;
  phone?: string; // Added for compatibility with database
  date_of_birth?: string; // Added for compatibility with database
  blood_group?: string; // Added for compatibility with database
}

export interface InvoiceItem {
  id: string;
  testId: number; // Changed from string to number
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
