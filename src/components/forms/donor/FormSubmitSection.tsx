
import { Button } from "@/components/ui/button";
import { useDonorForm } from "./DonorFormContext";

interface FormSubmitSectionProps {
  isEditable: boolean;
  isDeleting?: boolean;
}

const FormSubmitSection = ({ isEditable, isDeleting = false }: FormSubmitSectionProps) => {
  const { handleSubmit, handleDelete, isSubmitting } = useDonorForm();

  if (!isEditable && !isDeleting) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-end gap-2">
      {isDeleting ? (
        <Button 
          type="button" 
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Deleting..." : "Delete Donor"}
        </Button>
      ) : (
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      )}
    </div>
  );
};

export default FormSubmitSection;
