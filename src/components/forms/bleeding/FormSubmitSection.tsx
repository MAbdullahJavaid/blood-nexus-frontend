
import { Button } from "@/components/ui/button";
import { useBleedingForm } from "./BleedingFormContext";
import { toast } from "@/hooks/use-toast";

interface FormSubmitSectionProps {
  isEditable: boolean;
  isDeleting?: boolean;
}

const FormSubmitSection = ({ isEditable, isDeleting = false }: FormSubmitSectionProps) => {
  const { 
    bagNo, 
    isSubmitting, 
    handleDelete
  } = useBleedingForm();

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

  // Only show delete button when in deleting mode and bag is selected
  if (!isDeleting) {
    return null;
  }

  // For delete mode, require bag selection
  if (!bagNo || bagNo === "Auto-generated on save") {
    return (
      <div className="mt-6 flex justify-end">
        <p className="text-red-500">Please select a bag number to delete the bleeding record</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex justify-end">
      <Button 
        type="button" 
        onClick={handleDeleteClick}
        className="bg-red-600 hover:bg-red-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Deleting..." : "Delete Record"}
      </Button>
    </div>
  );
};

export default FormSubmitSection;
