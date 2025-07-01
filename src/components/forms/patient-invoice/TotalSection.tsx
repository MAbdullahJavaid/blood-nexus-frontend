
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface TotalSectionProps {
  totalAmount: number;
  receivedAmount: number;
  isEditable: boolean;
  onReceivedAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscountChange: (discount: number) => void;
}

export function TotalSection({ 
  totalAmount, 
  receivedAmount, 
  isEditable,
  onReceivedAmountChange,
  onDiscountChange
}: TotalSectionProps) {
  // Calculate discount automatically as totalAmount - receivedAmount
  const calculatedDiscount = Math.max(totalAmount - receivedAmount, 0);

  // Notify parent component when discount changes
  useEffect(() => {
    onDiscountChange(calculatedDiscount);
  }, [calculatedDiscount, onDiscountChange]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div></div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="discount" className="mb-0">Discount Amount:</Label>
          <Input 
            id="discount" 
            className="h-9 w-32 text-right bg-gray-100" 
            type="number" 
            value={calculatedDiscount} 
            readOnly
            disabled
          />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="total" className="mb-0">Net Amount:</Label>
          <Input 
            id="total" 
            className="h-9 w-32 text-right bg-green-100" 
            type="number" 
            value={totalAmount} 
            readOnly 
            disabled
          />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="received" className="mb-0">Amount Received:</Label>
          <Input 
            id="received" 
            className="h-9 w-32 text-right" 
            type="number" 
            value={receivedAmount} 
            onChange={onReceivedAmountChange}
            disabled={!isEditable} 
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
