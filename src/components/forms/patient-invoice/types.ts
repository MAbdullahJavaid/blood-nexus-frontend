
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
  name: string;
  hospital: string;
  gender: string;
  phoneNo: string;
  age: number;
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
