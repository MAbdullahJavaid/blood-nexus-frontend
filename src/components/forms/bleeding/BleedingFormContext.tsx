
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Donor } from "@/types/donor";
import { BagData, DonorPatientValues, TestResults, ProductInfo } from "./types";
import { 
  generateRandomScreeningValue,
  generateRandomHBValue,
  calculateTestResult,
  getFormattedDate
} from "./utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BleedingFormContextType {
  selectedDonor: Donor | null;
  setSelectedDonor: (donor: Donor | null) => void;
  bagNo: string;
  setBagNo: (bagNo: string) => void;
  bagType: string;
  setBagType: (bagType: string) => void;
  donorCategory: string;
  setDonorCategory: (category: string) => void;
  bleedingDate: string;
  setBleedingDate: (date: string) => void;
  preparationDate: string;
  setPreparationDate: (date: string) => void;
  donorPatientValues: DonorPatientValues;
  setDonorPatientValues: React.Dispatch<React.SetStateAction<DonorPatientValues>>;
  results: TestResults;
  setResults: React.Dispatch<React.SetStateAction<TestResults>>;
  productInfo: ProductInfo;
  setProductInfo: React.Dispatch<React.SetStateAction<ProductInfo>>;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  handleDonorSelect: (donor: Donor) => void;
  handleDonorPatientValueChange: (test: keyof DonorPatientValues, value: string) => void;
  handleProductInfoChange: (key: keyof ProductInfo, value: boolean) => void;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
  loadBleedingRecord: (bagId: string) => Promise<void>;
  handleSubmit: () => Promise<void>;
  clearForm: () => void;
}

const BleedingFormContext = createContext<BleedingFormContextType | undefined>(undefined);

const getDefaultDonorPatientValues = () => ({
  hepB: generateRandomScreeningValue(),
  hepC: generateRandomScreeningValue(),
  hiv: generateRandomScreeningValue(),
  vdrl: generateRandomScreeningValue(),
  hb: generateRandomHBValue(),
});

const getDefaultProductInfo = () => ({
  WB: false,
  PC: true,
  FFP: true,
  PLT: false,
  CP: false,
  CS: false,
});

export const BleedingFormProvider: React.FC<{ 
  children: React.ReactNode; 
  isEditable?: boolean;
  isDeleting?: boolean;
}> = ({ 
  children, 
  isEditable = true,
  isDeleting = false
}) => {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [bagNo, setBagNo] = useState("Auto-generated on save");
  const [bagType, setBagType] = useState("double");
  const [donorCategory, setDonorCategory] = useState("Self Donor");
  const [bleedingDate, setBleedingDate] = useState(getFormattedDate());
  const [preparationDate, setPreparationDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with random values
  const [donorPatientValues, setDonorPatientValues] = useState<DonorPatientValues>(getDefaultDonorPatientValues());
  const [results, setResults] = useState<TestResults>({
    hepB: "",
    hepC: "",
    hiv: "",
    vdrl: "",
  });
  const [productInfo, setProductInfo] = useState<ProductInfo>(getDefaultProductInfo());

  const clearForm = () => {
    setSelectedDonor(null);
    setBagNo("Auto-generated on save");
    setBagType("double");
    setDonorCategory("Self Donor");
    setBleedingDate(getFormattedDate());
    const today = new Date();
    setPreparationDate(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`);
    setDonorPatientValues(getDefaultDonorPatientValues());
    setProductInfo(getDefaultProductInfo());
  };

  // Calculate results based on donor/patient values
  React.useEffect(() => {
    setResults({
      hepB: calculateTestResult(donorPatientValues.hepB),
      hepC: calculateTestResult(donorPatientValues.hepC),
      hiv: calculateTestResult(donorPatientValues.hiv),
      vdrl: calculateTestResult(donorPatientValues.vdrl),
    });
  }, [donorPatientValues]);

  // Handle donor selection
  const handleDonorSelect = async (donor: Donor) => {
    setSelectedDonor(donor);

    // Set the bleeding date to the donor's last donation date or today
    if (donor.last_donation_date) {
      const donorDate = new Date(donor.last_donation_date);
      const formattedDonorDate = `${donorDate.getDate().toString().padStart(2, '0')}/${(donorDate.getMonth() + 1).toString().padStart(2, '0')}/${donorDate.getFullYear()}`;
      setBleedingDate(formattedDonorDate);
    }
  };

  const loadBleedingRecord = async (bagId: string) => {
    try {
      const { data: bleedingRecord, error } = await supabase
        .from('bleeding_records')
        .select(`
          *,
          donors!inner(*)
        `)
        .eq('bag_id', bagId)
        .single();

      if (error) throw error;

      if (bleedingRecord && bleedingRecord.donors) {
        // Load the donor data
        setSelectedDonor(bleedingRecord.donors as Donor);
        setBagNo(bleedingRecord.bag_id);
        
        // Load bag type and donor category
        setBagType(bleedingRecord.bag_type || "double");
        setDonorCategory(bleedingRecord.donor_category || "voluntary");
        
        // Format bleeding date
        const bleedingDateObj = new Date(bleedingRecord.bleeding_date);
        const formattedBleedingDate = `${bleedingDateObj.getDate().toString().padStart(2, '0')}/${(bleedingDateObj.getMonth() + 1).toString().padStart(2, '0')}/${bleedingDateObj.getFullYear()}`;
        setBleedingDate(formattedBleedingDate);

        // Set preparation date from database if available, otherwise use current date
        if (bleedingRecord.created_at) {
          const prepDate = new Date(bleedingRecord.created_at);
          setPreparationDate(`${prepDate.getFullYear()}-${(prepDate.getMonth() + 1).toString().padStart(2, '0')}-${prepDate.getDate().toString().padStart(2, '0')}`);
        }

        // Load screening results from the database columns
        if (bleedingRecord.hbsag !== null || bleedingRecord.hcv !== null || 
            bleedingRecord.hiv !== null || bleedingRecord.vdrl !== null || 
            bleedingRecord.hb !== null) {
          setDonorPatientValues({
            hepB: bleedingRecord.hbsag?.toString() || '',
            hepC: bleedingRecord.hcv?.toString() || '',
            hiv: bleedingRecord.hiv?.toString() || '',
            vdrl: bleedingRecord.vdrl?.toString() || '',
            hb: bleedingRecord.hb?.toString() || '',
          });
        }

        // Load product information if available
        try {
          const { data: products, error: productError } = await supabase
            .from('products')
            .select('product')
            .eq('bag_no', bagId);

          if (!productError && products) {
            const newProductInfo = { ...productInfo };
            // Reset all to false first
            Object.keys(newProductInfo).forEach(key => {
              newProductInfo[key as keyof ProductInfo] = false;
            });
            // Set true for found products
            products.forEach(p => {
              if (p.product in newProductInfo) {
                newProductInfo[p.product as keyof ProductInfo] = true;
              }
            });
            setProductInfo(newProductInfo);
          }
        } catch (error) {
          console.error('Error loading product information:', error);
        }
      }
    } catch (error) {
      console.error('Error loading bleeding record:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    console.log("BleedingFormContext: Starting handleSubmit", { selectedDonor, donorCategory, bagType });
    
    if (!selectedDonor || !selectedDonor.name || !selectedDonor.donor_id) {
      toast({
        title: "Error",
        description: "Please select a donor with both name and donor number",
        variant: "destructive",
      });
      throw new Error("Please select a donor with both name and donor number");
    }

    try {
      setIsSubmitting(true);
      
      // Format the date for database storage (YYYY-MM-DD)
      const dateArr = bleedingDate.split('/');
      const formattedBleedingDate = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
      
      console.log("BleedingFormContext: Submitting bleeding record with data:", {
        donor_id: selectedDonor.id,
        bleeding_date: formattedBleedingDate,
        technician: "Current User",
        donor_category: donorCategory,
        bag_type: bagType,
        hbsag: parseFloat(donorPatientValues.hepB) || null,
        hcv: parseFloat(donorPatientValues.hepC) || null,
        hiv: parseFloat(donorPatientValues.hiv) || null,
        vdrl: parseFloat(donorPatientValues.vdrl) || null,
        hb: parseFloat(donorPatientValues.hb) || null,
        remarks: `Test Results - HepB: ${results.hepB}, HepC: ${results.hepC}, HIV: ${results.hiv}, VDRL: ${results.vdrl}`
      });
      
      // Save to bleeding_records table - let the database generate the bag_id from sequence
      const { data, error } = await supabase
        .from('bleeding_records')
        .insert({
          donor_id: selectedDonor.id,
          bleeding_date: formattedBleedingDate,
          technician: "Current User",
          donor_category: donorCategory,
          bag_type: bagType,
          hbsag: parseFloat(donorPatientValues.hepB) || null,
          hcv: parseFloat(donorPatientValues.hepC) || null,
          hiv: parseFloat(donorPatientValues.hiv) || null,
          vdrl: parseFloat(donorPatientValues.vdrl) || null,
          hb: parseFloat(donorPatientValues.hb) || null,
          remarks: `Test Results - HepB: ${results.hepB}, HepC: ${results.hepC}, HIV: ${results.hiv}, VDRL: ${results.vdrl}`
        })
        .select('bag_id')
        .single();
      
      if (error) {
        console.error("BleedingFormContext: Database error:", error);
        throw error;
      }
      
      console.log("BleedingFormContext: Successfully saved bleeding record:", data);
      
      // Update the bag number in the form context
      if (data && data.bag_id) {
        setBagNo(data.bag_id);
        
        // Save product information to products table
        const selectedProducts = Object.entries(productInfo)
          .filter(([key, value]) => value)
          .map(([key]) => key);

        if (selectedProducts.length > 0) {
          const productInserts = selectedProducts.map(product => ({
            bag_no: data.bag_id,
            donor_name: selectedDonor.name,
            product: product
          }));

          const { error: productError } = await supabase
            .from('products')
            .insert(productInserts);

          if (productError) {
            console.error("BleedingFormContext: Error saving products:", productError);
            // Don't throw here, bleeding record was saved successfully
          }
        }
      }

      toast({
        title: "Success",
        description: "Bleeding record saved successfully",
      });

      // Don't clear form after successful submission - this was the issue
      // clearForm(); // REMOVED - form should not be cleared on save
      
    } catch (error) {
      console.error("BleedingFormContext: Error saving bleeding record:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    console.log("BleedingFormContext: Starting handleDelete", { bagNo });
    
    if (!bagNo || bagNo === "Auto-generated on save") {
      toast({
        title: "Error",
        description: "Please select a bleeding record to delete",
        variant: "destructive",
      });
      throw new Error("No bleeding record selected for deletion");
    }

    try {
      setIsSubmitting(true);
      
      // Delete products first (due to foreign key constraint)
      await supabase
        .from('products')
        .delete()
        .eq('bag_no', bagNo);
      
      // Then delete bleeding record
      const { error } = await supabase
        .from('bleeding_records')
        .delete()
        .eq('bag_id', bagNo);
      
      if (error) throw error;

      console.log("BleedingFormContext: Delete successful");
      toast({
        title: "Success",
        description: "Bleeding record deleted successfully",
      });
      
      // Clear form after successful deletion
      clearForm();
      
    } catch (error) {
      console.error("BleedingFormContext: Error deleting bleeding record:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonorPatientValueChange = (test: keyof DonorPatientValues, value: string) => {
    setDonorPatientValues(prev => ({
      ...prev,
      [test]: value
    }));
  };

  const handleProductInfoChange = (key: keyof ProductInfo, value: boolean) => {
    setProductInfo(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <BleedingFormContext.Provider value={{
      selectedDonor,
      setSelectedDonor,
      bagNo,
      setBagNo,
      bagType,
      setBagType,
      donorCategory,
      setDonorCategory,
      bleedingDate,
      setBleedingDate,
      preparationDate,
      setPreparationDate,
      donorPatientValues,
      setDonorPatientValues,
      results,
      setResults,
      productInfo,
      setProductInfo,
      isSubmitting,
      setIsSubmitting,
      handleDonorSelect,
      handleDonorPatientValueChange,
      handleProductInfoChange,
      handleDelete,
      isDeleting,
      loadBleedingRecord,
      handleSubmit,
      clearForm
    }}>
      {children}
    </BleedingFormContext.Provider>
  );
};

export const useBleedingForm = () => {
  const context = useContext(BleedingFormContext);
  if (context === undefined) {
    throw new Error("useBleedingForm must be used within a BleedingFormProvider");
  }
  return context;
};
