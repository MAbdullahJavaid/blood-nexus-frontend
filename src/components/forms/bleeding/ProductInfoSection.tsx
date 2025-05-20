
import { Checkbox } from "@/components/ui/checkbox";
import { ProductInfo } from "./types";

interface ProductInfoSectionProps {
  productInfo: ProductInfo;
  isEditable: boolean;
  onProductInfoChange: (key: keyof ProductInfo, value: boolean) => void;
}

const ProductInfoSection = ({
  productInfo,
  isEditable,
  onProductInfoChange,
}: ProductInfoSectionProps) => {
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
                  onProductInfoChange(key as keyof ProductInfo, !!newValue)}
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
