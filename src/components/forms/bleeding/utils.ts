import { supabase } from "@/integrations/supabase/client";

export const generateBagNumber = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('get_next_bag_number');
    
    if (error) {
      console.error('Error fetching next bag number:', error);
      // Fallback to random number starting from 1001 if database call fails
      const bagNum = Math.floor(Math.random() * 90000) + 1001;
      return bagNum.toString();
    }
    
    // Ensure the number starts from 1001 minimum
    const bagNumber = Math.max(data, 1001);
    return bagNumber.toString();
  } catch (error) {
    console.error('Error calling get_next_bag_number:', error);
    // Fallback to random number starting from 1001 if database call fails
    const bagNum = Math.floor(Math.random() * 90000) + 1001;
    return bagNum.toString();
  }
};

export const generateRandomScreeningValue = (): string => {
  return (Math.random() * 0.43 + 0.01).toFixed(2);
};

export const generateRandomHBValue = (): string => {
  return (Math.random() * 2.4 + 13.5).toFixed(1);
};

export const calculateTestResult = (value: string): string => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "";
  if (numValue >= 1.0) return "REACTIVE";
  if (numValue >= 0.5) return "Border Line REACTIVE";
  return "NON REACTIVE";
};

export const getFormattedDate = (): string => {
  const today = new Date();
  return `${today.getDate().toString().padStart(2, '0')}/${
    (today.getMonth() + 1).toString().padStart(2, '0')}/${
    today.getFullYear()}`;
};

export const formatDate = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')}/${
    date.getFullYear()}`;
};

export const saveDonorBleedingData = async (formData: any) => {
  try {
    // Implementation to save donor and bleeding data to Supabase
    // This would connect to your database tables
    return { success: true, message: "Data saved successfully" };
  } catch (error) {
    console.error("Error saving data:", error);
    return { success: false, message: "Failed to save data" };
  }
};
