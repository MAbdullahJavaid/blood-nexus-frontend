
import { Donor } from "@/types/donor";

export type BleedingFormProps = {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
};

export type DonorPatientValues = {
  hepB: string;
  hepC: string;
  hiv: string;
  vdrl: string;
  hb: string;
};

export type TestResults = {
  hepB: string;
  hepC: string;
  hiv: string;
  vdrl: string;
};

export type ProductInfo = {
  WB: boolean;
  PC: boolean;
  FFP: boolean;
  PLT: boolean;
  CP: boolean;
  CS: boolean;
};

export type BagData = {
  id: string;
  bag_id: string;
  donor_id: string;
  bleeding_date: string;
  expiry_date?: string;
  technician?: string;
  remarks?: string;
};
