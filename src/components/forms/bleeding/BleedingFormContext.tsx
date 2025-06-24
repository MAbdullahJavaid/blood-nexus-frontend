
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
    console.log("BleedingForm: Form cleared");
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
        handleDelete 
      }}
    >
      {children}
    </BleedingFormContext.Provider>
  );
};
