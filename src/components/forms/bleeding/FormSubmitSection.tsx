
import { Button } from "@/components/ui/button";
import { useBleedingForm } from "./BleedingFormContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FormSubmitSectionProps {
  isEditable: boolean;
}

const FormSubmitSection = ({ isEditable }: FormSubmitSectionProps) => {
  const { 
    selectedDonor, 
    bagNo, 
    bleedingDate, 
    donorPatientValues, 
    results, 
    isSubmitting, 
    setIsSubmitting 
  } = useBleedingForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDonor) {
      toast({
        title: "Error",
        description: "Please select a donor first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format the date for database storage (YYYY-MM-DD)
      const dateArr = bleedingDate.split('/');
      const formattedBleedingDate = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
      
      // Save to bleeding_records table
      const { data, error } = await supabase
        .from('bleeding_records')
        .insert({
          bag_id: bagNo,
          donor_id: selectedDonor.id,
          bleeding_date: formattedBleedingDate,
          technician: "Current User", // You might want to get this from user context
          remarks: `HB: ${donorPatientValues.hb}, HepB: ${results.hepB}, HepC: ${results.hepC}, HIV: ${results.hiv}, VDRL: ${results.vdrl}`
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Bleeding record saved successfully",
      });
      
    } catch (error) {
      console.error("Error saving bleeding record:", error);
      toast({
        title: "Error",
        description: "Failed to save bleeding record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditable) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-end">
      <Button 
        type="submit" 
        className="bg-red-600 hover:bg-red-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default FormSubmitSection;
