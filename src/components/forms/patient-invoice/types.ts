
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
  phone: string; // Changed from phoneNo to phone to match database
  age: number;
  date_of_birth?: string;
  blood_group?: string;
  address?: string; // Added missing property from database
  email?: string; // Added missing property from database
  bottle_quantity?: number; // Added missing property from database
  bottle_unit_type?: string; // Added missing property from database
  created_at?: string; // Added missing property from database
  created_by?: string; // Added missing property from database
  updated_at?: string; // Added missing property from database
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
