
import { Button } from "@/components/ui/button";
import { useDonorForm } from "./DonorFormContext";

interface FormSubmitSectionProps {
  isEditable: boolean;
  isDeleting?: boolean;
}

const FormSubmitSection = ({ isEditable, isDeleting = false }: FormSubmitSectionProps) => {
  const { handleDelete, isSubmitting } = useDonorForm();

  // Only show delete button when in deleting mode
  if (!isDeleting) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-end gap-2">
      <Button 
        type="button" 
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Deleting..." : "Delete Donor"}
      </Button>
    </div>
  );
};

export default FormSubmitSection;
