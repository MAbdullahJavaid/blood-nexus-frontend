
export interface PreCrossmatchData {
  document_no: string;
  patient_name: string;
  age?: number;
  sex?: string;
  blood_group?: string;
  rh?: string;
  hospital?: string;
}

export interface ProductData {
  id: string;
  bag_no: string;
  donor_name: string;
  product: string;
  blood_group?: string; // Added blood group field
  created_at: string;
  updated_at: string;
}

export interface DonorItem {
  id: string;
  bagNo: string;
  pipeNo: string;
  name: string;
  product: string;
  quantity: number;
  unit: string;
}

export interface CrossmatchRecord {
  id: string;
  crossmatch_no: string;
  patient_name: string;
  age?: number;
  sex?: string;
  blood_group?: string;
  rh?: string;
  hospital?: string;
  quantity: number;
  date: string;
  blood_category?: string;
  albumin: string;
  saline: string;
  coomb: string;
  result: string;
  expiry_date?: string;
  remarks?: string;
  product_id?: string;
  pre_crossmatch_doc_no?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CrossmatchFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}
