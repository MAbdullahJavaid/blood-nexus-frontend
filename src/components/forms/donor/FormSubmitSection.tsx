
import { Button } from "@/components/ui/button";
import { useDonorForm } from "./DonorFormContext";

interface FormSubmitSectionProps {
  isEditable: boolean;
}

const FormSubmitSection = ({ isEditable }: FormSubmitSectionProps) => {
  const { handleSubmit, isSubmitting } = useDonorForm();
  
  if (!isEditable) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-end">
      <Button 
        type="button" 
        onClick={handleSubmit}
        className="bg-red-600 hover:bg-red-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default FormSubmitSection;
