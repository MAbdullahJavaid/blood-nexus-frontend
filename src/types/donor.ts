
export interface Donor {
  id: string;
  donor_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  blood_group_separate?: string; // Added for new separate field
  rh_factor?: string; // Added for new separate field
  last_donation_date?: string;
  created_at?: string;
  updated_at?: string;
}
