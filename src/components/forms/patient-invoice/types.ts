
import { ForwardedRef } from "react";

export interface PatientInvoiceFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

export interface FormRefObject {
  handleAddItem?: () => void;
  handleDeleteItem?: () => void;
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
  testId: string;
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
  id: string;
  name: string;
  rate: number;
}
