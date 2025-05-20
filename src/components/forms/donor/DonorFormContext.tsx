
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
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (isOpen: boolean) => void;
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
  status: false,
};

const DonorFormContext = createContext<DonorFormContextType | undefined>(undefined);

interface DonorFormProviderProps {
  children: ReactNode;
  isEditable?: boolean;
}

export const DonorFormProvider: React.FC<DonorFormProviderProps> = ({ 
  children, 
  isEditable = true 
}) => {
  const [donorData, setDonorData] = useState<DonorData>(defaultDonorData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleInputChange = (field: keyof DonorData, value: string | boolean) => {
    setDonorData(prev => ({
      ...prev,
      [field]: value
    }));
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
      
      const { error } = await supabase
        .from('donors')
        .insert({
          donor_id: donorData.regNo,
          name: donorData.name,
          address: donorData.address,
          gender: donorData.sex,
          blood_group: `${donorData.group}${donorData.rh === '+ve' ? '+' : '-'}`,
          phone: donorData.phoneRes,
          email: "",
          date_of_birth: donorData.age ? new Date(new Date().getFullYear() - parseInt(donorData.age), 0, 1).toISOString().split('T')[0] : null,
          last_donation_date: donorData.date
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Donor information saved successfully",
      });
      
      // Reset form
      setDonorData(defaultDonorData);
      
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

  return (
    <DonorFormContext.Provider value={{
      donorData,
      setDonorData,
      isSubmitting,
      setIsSubmitting,
      handleInputChange,
      handleSubmit,
      isSearchModalOpen,
      setIsSearchModalOpen
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
