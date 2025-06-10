
export interface DonorItem {
  id: string;
  bagNo: string;
  pipeNo: string;
  name: string;
  product: string;
  quantity: number;
  unit: string;
}

export interface PreCrossmatchData {
  document_no: string;
  patient_name: string;
  age: number | null;
  sex: string | null;
  blood_group: string | null;
  rh: string | null;
  hospital: string | null;
}

export interface ProductData {
  id: string;
  bag_no: string;
  donor_name: string;
  product: string;
}

export interface CrossmatchRecord {
  id: string;
  crossmatch_no: string;
  quantity: number;
  date: string;
  patient_name: string;
  age: number | null;
  sex: string | null;
  blood_group: string | null;
  rh: string | null;
  hospital: string | null;
  blood_category: string | null;
  albumin: string;
  saline: string;
  coomb: string;
  result: string;
  expiry_date: string | null;
  remarks: string | null;
  product_id: string | null;
}

export interface CrossmatchFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}
