
import { Checkbox } from "@/components/ui/checkbox";
import { useBleedingForm } from "./BleedingFormContext";

interface ProductInfoSectionProps {
  isEditable: boolean;
}

const ProductInfoSection = ({ isEditable }: ProductInfoSectionProps) => {
  const { productInfo, handleProductInfoChange } = useBleedingForm();
  
  return (
    <div className="mt-4">
      <div className="border p-3 rounded-md">
        <div className="text-red-600 font-medium mb-2">Blood Product Information</div>
        <div className="grid grid-cols-6 gap-2 text-center">
          {Object.entries(productInfo).map(([key, checked]) => (
            <div key={key} className="flex flex-col items-center">
              <div className="bg-blue-600 text-white p-1 w-full">{key}</div>
              <Checkbox 
                id={`product-${key}`}
                checked={checked} 
                onCheckedChange={(newValue) => 
                  handleProductInfoChange(key as keyof typeof productInfo, !!newValue)}
                disabled={!isEditable}
                className="mt-2 h-5 w-5"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSection;
