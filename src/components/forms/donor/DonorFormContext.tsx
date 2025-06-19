
import React, { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useFormValidation, FormValidationConfig } from "@/hooks/useFormValidation";
import { FieldValidationRules } from "@/lib/validation";

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
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  validationErrors: Record<string, string>;
  isFormValid: boolean;
  validateField: (field: keyof DonorData, value: string) => boolean;
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
  status: true,
};

const validationConfig: FormValidationConfig = {
  regNo: FieldValidationRules.regNo,
  name: FieldValidationRules.name,
  address: { ...FieldValidationRules.address, required: false },
  age: FieldValidationRules.age,
  phoneRes: FieldValidationRules.phone,
  phoneOffice: FieldValidationRules.phone,
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
  const [isEditing, setIsEditing] = useState(false);

  const getStringFieldsForValidation = (data: DonorData): Record<string, string> => {
    return {
      regNo: data.regNo,
      name: data.name,
      date: data.date,
      address: data.address,
      age: data.age,
      sex: data.sex,
      group: data.group,
      rh: data.rh,
      phoneRes: data.phoneRes,
      phoneOffice: data.phoneOffice,
      remarks: data.remarks,
    };
  };

  const {
    fields,
    updateField,
    validateForm,
    resetForm,
    isFormValid,
    setFieldError,
  } = useFormValidation(getStringFieldsForValidation(donorData), validationConfig);

  const validationErrors = Object.keys(fields).reduce((acc, key) => {
    acc[key] = fields[key].error;
    return acc;
  }, {} as Record<string, string>);

  const validateField = (field: keyof DonorData, value: string): boolean => {
    const rule = validationConfig[field];
    if (!rule) return true;
    
    const result = require("@/lib/validation").validateField(value, rule);
    return result.isValid;
  };

  const clearForm = () => {
    console.log("DonorFormContext: Clearing form");
    setDonorData(defaultDonorData);
    setIsSearchModalOpen(false);
    setIsEditing(false);
    resetForm();
  };

  const handleInputChange = (field: keyof DonorData, value: string | boolean) => {
    console.log("DonorFormContext: Input change", field, value);
    const newData = {
      ...donorData,
      [field]: value
    };
    setDonorData(newData);

    // Update validation fields to match the new data
    if (typeof value === "string" && validationConfig[field]) {
      updateField(field, value, validateField(field, value));
    }
  };

  const loadDonorData = (donor: any) => {
    console.log("DonorFormContext: Loading donor data", donor);
    const group = donor.blood_group_separate || donor.blood_group?.replace(/[+-]/g, '') || 'B';
    const rh = donor.rh_factor || (donor.blood_group?.includes('+') ? '+ve' : donor.blood_group?.includes('-') ? '-ve' : '+ve');
    const age = donor.date_of_birth 
      ? (new Date().getFullYear() - new Date(donor.date_of_birth).getFullYear()).toString() 
      : '';
    const registrationDate = donor.created_at 
      ? new Date(donor.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const newData = {
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
      status: donor.status !== undefined ? donor.status : true
    };
    
    setDonorData(newData);
    setIsEditing(true);
    
    // Update validation fields to match the loaded data
    const stringFields = getStringFieldsForValidation(newData);
    Object.keys(stringFields).forEach(key => {
      if (validationConfig[key]) {
        updateField(key, stringFields[key], validateField(key as keyof DonorData, stringFields[key]));
      }
    });
  };

  const handleSubmit = async () => {
    console.log("DonorFormContext: Starting handleSubmit", { donorData, isEditing });
    
    // Update validation fields to current data before validating
    const stringFields = getStringFieldsForValidation(donorData);
    Object.keys(stringFields).forEach(key => {
      if (validationConfig[key]) {
        updateField(key, stringFields[key], validateField(key as keyof DonorData, stringFields[key]));
      }
    });
    
    // Wait a tick for validation to update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    if (!validateForm()) {
      console.log("DonorFormContext: Form validation failed");
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting",
        variant: "destructive",
      });
      throw new Error("Form validation failed");
    }

    if (!donorData.name.trim() || !donorData.regNo.trim()) {
      console.log("DonorFormContext: Missing required fields");
      toast({
        title: "Error",
        description: "Please provide registration number and name",
        variant: "destructive",
      });
      throw new Error("Missing required fields");
    }
    
    try {
      setIsSubmitting(true);

      if (!isEditing) {
        const { data: existingDonor, error: checkError } = await supabase
          .from('donors')
          .select('donor_id')
          .eq('donor_id', donorData.regNo)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Error checking for existing donor:", checkError);
          throw new Error("Failed to validate donor registration number");
        }

        if (existingDonor) {
          throw new Error(`Donor with registration number ${donorData.regNo} already exists`);
        }
      }

      let bloodGroupSeparate = null;
      let rhFactor = null;
      let combinedBloodGroup = null;

      if (donorData.group !== "--" && donorData.rh !== "--") {
        bloodGroupSeparate = donorData.group;
        rhFactor = donorData.rh;
        const rhValue = donorData.rh === "+ve" ? "+" : "-";
        combinedBloodGroup = `${donorData.group}${rhValue}`;
      }

      if (isEditing) {
        const { error } = await supabase
          .from('donors')
          .update({
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
            status: donorData.status
          })
          .eq('donor_id', donorData.regNo);

        if (error) {
          throw new Error("Failed to update donor information");
        }
      } else {
        const { error } = await supabase
          .from('donors')
          .insert({
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
            status: donorData.status
          });

        if (error) {
          if (
            error.code === "23505" ||
            (typeof error.message === "string" && error.message.includes("donor_id"))
          ) {
            throw new Error("Donor with this registration number already exists");
          } else {
            throw new Error("Failed to save donor information");
          }
        }
      }

      console.log("DonorFormContext: Save successful");
      toast({
        title: "Success",
        description: isEditing ? "Donor information updated successfully" : "Donor information saved successfully",
      });

      clearForm();
      
    } catch (error) {
      console.error("DonorFormContext: Error saving donor:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    console.log("DonorFormContext: Starting handleDelete", { regNo: donorData.regNo });
    
    if (!donorData.regNo.trim()) {
      toast({
        title: "Error",
        description: "Please select a donor to delete",
        variant: "destructive",
      });
      throw new Error("No donor selected for deletion");
    }
    
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('donor_id', donorData.regNo);

      if (error) throw error;

      console.log("DonorFormContext: Delete successful");
      toast({
        title: "Success",
        description: "Donor deleted successfully",
      });

      clearForm();
      
    } catch (error) {
      console.error("DonorFormContext: Error deleting donor:", error);
      throw error;
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
      clearForm,
      isEditing,
      setIsEditing,
      validationErrors,
      isFormValid,
      validateField
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
