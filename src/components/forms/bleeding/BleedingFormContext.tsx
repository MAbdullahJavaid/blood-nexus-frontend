
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DonorData {
  donor_id: string;
  name: string;
  blood_group: string;
  age: number;
  phone: string;
  address: string;
  blood_group_separate?: string;
  rh_factor?: string;
}

export interface BleedingFormData {
  bleedingDate: string;
  bagId: string;
  technician: string;
  remarks: string;
  hbsag: number;
  hcv: number;
  hiv: number;
  vdrl: number;
  hb: string;
  donor: DonorData | null;
}

interface BleedingFormContextType {
  formData: BleedingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BleedingFormData>>;
  clearForm: () => void;
  handleSubmit: () => Promise<void>;
  handleDelete: () => Promise<void>;
  // Additional properties needed by components
  selectedDonor: DonorData | null;
  handleDonorSelect: (donor: DonorData) => void;
  donorCategory: string;
  setDonorCategory: (category: string) => void;
  bagNo: string;
  setBagNo: (bagNo: string) => void;
  bagType: string;
  setBagType: (bagType: string) => void;
  loadBleedingRecord: (bagId: string) => Promise<void>;
}

const BleedingFormContext = createContext<BleedingFormContextType | undefined>(undefined);

export const useBleedingForm = () => {
  const context = useContext(BleedingFormContext);
  if (!context) {
    throw new Error('useBleedingForm must be used within a BleedingFormProvider');
  }
  return context;
};

interface BleedingFormProviderProps {
  children: ReactNode;
  isEditable: boolean;
  isDeleting: boolean;
}

export const BleedingFormProvider: React.FC<BleedingFormProviderProps> = ({ 
  children, 
  isEditable, 
  isDeleting 
}) => {
  const [formData, setFormData] = useState<BleedingFormData>({
    bleedingDate: new Date().toISOString().split('T')[0],
    bagId: '',
    technician: '',
    remarks: '',
    hbsag: 0,
    hcv: 0,
    hiv: 0,
    vdrl: 0,
    hb: '',
    donor: null
  });

  const [donorCategory, setDonorCategory] = useState<string>('Self Donor');
  const [bagNo, setBagNo] = useState<string>('');
  const [bagType, setBagType] = useState<string>('double');

  const clearForm = () => {
    setFormData({
      bleedingDate: new Date().toISOString().split('T')[0],
      bagId: '',
      technician: '',
      remarks: '',
      hbsag: 0,
      hcv: 0,
      hiv: 0,
      vdrl: 0,
      hb: '',
      donor: null
    });
    setBagNo('');
    setBagType('double');
    setDonorCategory('Self Donor');
    console.log("BleedingForm: Form cleared");
  };

  const handleDonorSelect = (donor: DonorData) => {
    setFormData(prev => ({ ...prev, donor }));
    console.log("BleedingForm: Donor selected:", donor);
  };

  const loadBleedingRecord = async (bagId: string) => {
    try {
      console.log("BleedingForm: Loading bleeding record for bag ID:", bagId);
      
      const { data, error } = await supabase
        .from('bleeding_records')
        .select(`
          *,
          donors:donor_id (
            donor_id,
            name,
            blood_group,
            blood_group_separate,
            rh_factor,
            phone,
            address,
            date_of_birth
          )
        `)
        .eq('bag_id', bagId)
        .single();

      if (error) {
        console.error("BleedingForm: Error loading bleeding record:", error);
        toast.error("Failed to load bleeding record");
        return;
      }

      if (data) {
        const donor = Array.isArray(data.donors) ? data.donors[0] : data.donors;
        
        setFormData({
          bleedingDate: data.bleeding_date,
          bagId: data.bag_id,
          technician: data.technician || '',
          remarks: data.remarks || '',
          hbsag: data.hbsag || 0,
          hcv: data.hcv || 0,
          hiv: data.hiv || 0,
          vdrl: data.vdrl || 0,
          hb: data.hb?.toString() || '',
          donor: donor ? {
            donor_id: donor.donor_id,
            name: donor.name,
            blood_group: donor.blood_group,
            blood_group_separate: donor.blood_group_separate,
            rh_factor: donor.rh_factor,
            age: donor.date_of_birth ? new Date().getFullYear() - new Date(donor.date_of_birth).getFullYear() : 0,
            phone: donor.phone || '',
            address: donor.address || ''
          } : null
        });

        setBagNo(data.bag_id);
        setBagType(data.bag_type || 'double');
        setDonorCategory(data.donor_category || 'Self Donor');
        
        console.log("BleedingForm: Record loaded successfully");
      }
    } catch (error) {
      console.error("BleedingForm: Error during load:", error);
      toast.error("Failed to load bleeding record");
    }
  };

  const handleSubmit = async () => {
    if (!formData.donor) {
      toast.error("Please select a donor first");
      return;
    }

    try {
      console.log("BleedingForm: Submitting form data:", formData);
      
      const { data, error } = await supabase
        .from('bleeding_records')
        .insert({
          donor_id: formData.donor.donor_id,
          bleeding_date: formData.bleedingDate,
          bag_id: formData.bagId,
          technician: formData.technician,
          remarks: formData.remarks,
          hbsag: formData.hbsag,
          hcv: formData.hcv,
          hiv: formData.hiv,
          vdrl: formData.vdrl,
          hb: parseFloat(formData.hb) || 0
        });

      if (error) {
        console.error("BleedingForm: Database error:", error);
        toast.error("Failed to save bleeding record");
        throw error;
      }

      console.log("BleedingForm: Save successful");
      toast.success("Bleeding record saved successfully");
      clearForm();
    } catch (error) {
      console.error("BleedingForm: Error during save:", error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!formData.bagId) {
      toast.error("No record selected for deletion");
      return;
    }

    try {
      console.log("BleedingForm: Deleting record with bag ID:", formData.bagId);
      
      const { error } = await supabase
        .from('bleeding_records')
        .delete()
        .eq('bag_id', formData.bagId);

      if (error) {
        console.error("BleedingForm: Delete error:", error);
        toast.error("Failed to delete bleeding record");
        throw error;
      }

      console.log("BleedingForm: Delete successful");
      toast.success("Bleeding record deleted successfully");
      clearForm();
    } catch (error) {
      console.error("BleedingForm: Error during delete:", error);
      throw error;
    }
  };

  return (
    <BleedingFormContext.Provider 
      value={{ 
        formData, 
        setFormData, 
        clearForm, 
        handleSubmit, 
        handleDelete,
        selectedDonor: formData.donor,
        handleDonorSelect,
        donorCategory,
        setDonorCategory,
        bagNo,
        setBagNo,
        bagType,
        setBagType,
        loadBleedingRecord
      }}
    >
      {children}
    </BleedingFormContext.Provider>
  );
};
