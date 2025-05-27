
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Donor } from "@/types/donor";
import { BagData, DonorPatientValues, TestResults, ProductInfo } from "./types";
import { 
  generateRandomScreeningValue,
  generateRandomHBValue,
  calculateTestResult,
  getFormattedDate
} from "./utils";

interface BleedingFormContextType {
  selectedDonor: Donor | null;
  setSelectedDonor: (donor: Donor | null) => void;
  bagNo: string;
  setBagNo: (bagNo: string) => void;
  bagType: string;
  setBagType: (bagType: string) => void;
  bleedingDate: string;
  setBleedingDate: (date: string) => void;
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
}

const BleedingFormContext = createContext<BleedingFormContextType | undefined>(undefined);

export const BleedingFormProvider: React.FC<{ children: ReactNode; isEditable?: boolean }> = ({ 
  children, 
  isEditable = true 
}) => {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [bagNo, setBagNo] = useState("Auto-generated on save");
  const [bagType, setBagType] = useState("double");
  const [bleedingDate, setBleedingDate] = useState(getFormattedDate());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with random values
  const [donorPatientValues, setDonorPatientValues] = useState<DonorPatientValues>({
    hepB: generateRandomScreeningValue(),
    hepC: generateRandomScreeningValue(),
    hiv: generateRandomScreeningValue(),
    vdrl: generateRandomScreeningValue(),
    hb: generateRandomHBValue(),
  });

  const [results, setResults] = useState<TestResults>({
    hepB: "",
    hepC: "",
    hiv: "",
    vdrl: "",
  });

  const [productInfo, setProductInfo] = useState<ProductInfo>({
    WB: false,
    PC: true,
    FFP: true,
    PLT: false,
    CP: false,
    CS: false,
  });

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
  const handleDonorSelect = (donor: Donor) => {
    setSelectedDonor(donor);
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
      bleedingDate,
      setBleedingDate,
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
      handleProductInfoChange
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
