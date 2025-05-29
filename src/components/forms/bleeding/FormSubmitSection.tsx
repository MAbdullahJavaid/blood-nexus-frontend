
import { Button } from "@/components/ui/button";
import { useBleedingForm } from "./BleedingFormContext";
import { toast } from "@/hooks/use-toast";

interface FormSubmitSectionProps {
  isEditable: boolean;
  isDeleting?: boolean;
}

const FormSubmitSection = ({ isEditable, isDeleting = false }: FormSubmitSectionProps) => {
  const { 
    selectedDonor, 
    bagNo, 
    isSubmitting, 
    handleDelete,
    handleSubmit
  } = useBleedingForm();

  const handleSubmitClick = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await handleSubmit();
      toast({
        title: "Success",
        description: `Bleeding record saved successfully with bag number: ${bagNo}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save bleeding record. Please try again.",
        variant: "destructive",
      });
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
          onClick={handleSubmitClick}
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
