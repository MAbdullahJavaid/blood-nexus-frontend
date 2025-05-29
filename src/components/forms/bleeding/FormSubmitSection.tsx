
import { Button } from "@/components/ui/button";
import { useBleedingForm } from "./BleedingFormContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FormSubmitSectionProps {
  isEditable: boolean;
  isDeleting?: boolean;
}

const FormSubmitSection = ({ isEditable, isDeleting = false }: FormSubmitSectionProps) => {
  const { 
    selectedDonor, 
    bagNo, 
    setBagNo,
    bleedingDate, 
    donorPatientValues, 
    results, 
    isSubmitting, 
    setIsSubmitting,
    handleDelete
  } = useBleedingForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDonor || !selectedDonor.name || !selectedDonor.donor_id) {
      toast({
        title: "Error",
        description: "Please select a donor with both name and donor number",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format the date for database storage (YYYY-MM-DD)
      const dateArr = bleedingDate.split('/');
      const formattedBleedingDate = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
      
      console.log("Submitting bleeding record with data:", {
        donor_id: selectedDonor.id,
        bleeding_date: formattedBleedingDate,
        technician: "Current User",
        remarks: `HB: ${donorPatientValues.hb}, HepB: ${results.hepB}, HepC: ${results.hepC}, HIV: ${results.hiv}, VDRL: ${results.vdrl}`
      });
      
      // Save to bleeding_records table - let the database generate the bag_id from sequence
      const { data, error } = await supabase
        .from('bleeding_records')
        .insert({
          donor_id: selectedDonor.id,
          bleeding_date: formattedBleedingDate,
          technician: "Current User", // You might want to get this from user context
          remarks: `HB: ${donorPatientValues.hb}, HepB: ${results.hepB}, HepC: ${results.hepC}, HIV: ${results.hiv}, VDRL: ${results.vdrl}`
        })
        .select('bag_id')
        .single();
      
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Successfully saved bleeding record:", data);
      
      // Update the bag number in the form context
      if (data && data.bag_id) {
        setBagNo(data.bag_id);
      }
      
      toast({
        title: "Success",
        description: `Bleeding record saved successfully with bag number: ${data.bag_id}`,
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

  const handleDeleteClick = async () => {
    try {
      await handleDelete();
      toast({
        title: "Success",
        description: "Bleeding record deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bleeding record",
        variant: "destructive",
      });
    }
  };

  if (!isEditable && !isDeleting) {
    return null;
  }

  // For delete mode, require bag selection
  if (isDeleting && (!bagNo || bagNo === "Auto-generated on save")) {
    return (
      <div className="mt-6 flex justify-end">
        <p className="text-red-500">Please select a bag number to delete the bleeding record</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex justify-end">
      {isDeleting ? (
        <Button 
          type="button" 
          onClick={handleDeleteClick}
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Deleting..." : "Delete Record"}
        </Button>
      ) : (
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting || !selectedDonor || !selectedDonor.name || !selectedDonor.donor_id}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      )}
    </div>
  );
};

export default FormSubmitSection;
