
import { Patient, Invoice, Test } from "./types";

// Mock patients data for demonstration
export const mockPatients: Patient[] = [
  { id: "P0001", name: "John Smith", hospital: "General Hospital", gender: "male", phoneNo: "555-1234", age: 45 },
  { id: "P0002", name: "Jane Doe", hospital: "City Medical", gender: "female", phoneNo: "555-5678", age: 32 },
  { id: "P0003", name: "Robert Johnson", hospital: "County Healthcare", gender: "male", phoneNo: "555-9012", age: 58 },
];

// Mock invoices data for demonstration
export const mockInvoices: Invoice[] = [
  { documentNo: "2505001", patientId: "P0001", patientName: "John Smith", date: "2025-05-15", amount: 275 },
  { documentNo: "2505002", patientId: "P0002", patientName: "Jane Doe", date: "2025-05-16", amount: 150 },
  { documentNo: "2505003", patientId: "P0003", patientName: "Robert Johnson", date: "2025-05-17", amount: 350 },
];

// Mock tests data for demonstration
export const mockTests: Test[] = [
  { id: "T001", name: "Complete Blood Count", rate: 100 },
  { id: "T002", name: "Blood Glucose", rate: 75 },
  { id: "T003", name: "Lipid Profile", rate: 150 },
  { id: "T004", name: "Liver Function", rate: 200 },
];
