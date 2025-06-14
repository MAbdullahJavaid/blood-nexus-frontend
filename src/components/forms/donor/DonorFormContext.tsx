import React, { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DonorData {
  regNo: string;
  name: string;
  date: string;
  address: string;
  age: string;
  sex: string;
  group: string;
  rh: string;
  phoneRes: string;
  phoneOffice: string;
  remarks: string;
  status: boolean;
}

interface DonorFormContextType {
  donorData: DonorData;
  setDonorData: React.Dispatch<React.SetStateAction<DonorData>>;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  handleInputChange: (field: keyof DonorData, value: string | boolean) => void;
  handleSubmit: () => Promise<void>;
  handleDelete: () => Promise<void>;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (isOpen: boolean) => void;
  isDeleting: boolean;
  loadDonorData: (donor: any) => void;
  clearForm: () => void;
}

const defaultDonorData: DonorData = {
  regNo: "",
  name: "",
  date: new Date().toISOString().split('T')[0],
  address: "",
  age: "",
  sex: "male",
  group: "B",
  rh: "+ve",
  phoneRes: "",
  phoneOffice: "",
  remarks: "",
  status: true, // Default to active
};

const DonorFormContext = createContext<DonorFormContextType | undefined>(undefined);

interface DonorFormProviderProps {
  children: ReactNode;
  isEditable?: boolean;
  isDeleting?: boolean;
}

export const DonorFormProvider: React.FC<DonorFormProviderProps> = ({ 
  children, 
  isEditable = true,
  isDeleting = false
}) => {
  const [donorData, setDonorData] = useState<DonorData>(defaultDonorData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const clearForm = () => {
    setDonorData(defaultDonorData);
    setIsSearchModalOpen(false);
  };

  const handleInputChange = (field: keyof DonorData, value: string | boolean) => {
    setDonorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadDonorData = (donor: any) => {
    const group = donor.blood_group_separate || donor.blood_group?.replace(/[+-]/g, '') || 'B';
    const rh = donor.rh_factor || (donor.blood_group?.includes('+') ? '+ve' : donor.blood_group?.includes('-') ? '-ve' : '+ve');
    const age = donor.date_of_birth 
      ? (new Date().getFullYear() - new Date(donor.date_of_birth).getFullYear()).toString() 
      : '';
    const registrationDate = donor.created_at 
      ? new Date(donor.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    setDonorData({
      regNo: donor.donor_id || '',
      name: donor.name || '',
      date: registrationDate,
      address: donor.address || '',
      age,
      sex: donor.gender || 'male',
      group,
      rh,
      phoneRes: donor.phone || '',
      phoneOffice: '',
      remarks: '',
      status: donor.status !== undefined ? donor.status : true // Load from DB, default to true if undefined
    });
  };

  const handleSubmit = async () => {
    if (!donorData.name || !donorData.regNo) {
      toast({
        title: "Error",
        description: "Please provide registration number and name",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);

      let bloodGroupSeparate = null;
      let rhFactor = null;
      let combinedBloodGroup = null;

      if (donorData.group !== "--" && donorData.rh !== "--") {
        bloodGroupSeparate = donorData.group;
        rhFactor = donorData.rh;
        const rhValue = donorData.rh === "+ve" ? "+" : "-";
        combinedBloodGroup = `${donorData.group}${rhValue}`;
      }

      const { error } = await supabase
        .from('donors')
        .upsert({
          donor_id: donorData.regNo,
          name: donorData.name,
          address: donorData.address,
          gender: donorData.sex,
          blood_group: combinedBloodGroup as any,
          blood_group_separate: bloodGroupSeparate,
          rh_factor: rhFactor,
          phone: donorData.phoneRes,
          email: "",
          date_of_birth: donorData.age ? new Date(new Date().getFullYear() - parseInt(donorData.age), 0, 1).toISOString().split('T')[0] : null,
          last_donation_date: donorData.date,
          status: donorData.status // <-- ADD THIS
        }, {
          onConflict: 'donor_id'
        });

      if (error) {
        if (
          error.code === "23505" ||
          (typeof error.message === "string" && error.message.includes("donor_id"))
        ) {
          toast({
            title: "Error",
            description: "Donor already exists",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to save donor information",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Success",
        description: "Donor information saved successfully",
      });

      clearForm();
      
    } catch (error) {
      console.error("Error saving donor:", error);
      toast({
        title: "Error",
        description: "Failed to save donor information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!donorData.regNo) {
      toast({
        title: "Error",
        description: "Please select a donor to delete",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('donor_id', donorData.regNo);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Donor deleted successfully",
      });

      clearForm();
      
    } catch (error) {
      console.error("Error deleting donor:", error);
      toast({
        title: "Error",
        description: "Failed to delete donor",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DonorFormContext.Provider value={{
      donorData,
      setDonorData,
      isSubmitting,
      setIsSubmitting,
      handleInputChange,
      handleSubmit,
      handleDelete,
      isSearchModalOpen,
      setIsSearchModalOpen,
      isDeleting,
      loadDonorData,
      clearForm
    }}>
      {children}
    </DonorFormContext.Provider>
  );
};

export const useDonorForm = () => {
  const context = useContext(DonorFormContext);
  if (context === undefined) {
    throw new Error("useDonorForm must be used within a DonorFormProvider");
  }
  return context;
};
