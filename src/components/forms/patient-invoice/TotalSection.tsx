
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TotalSectionProps {
  discount: number;
  totalAmount: number;
  receivedAmount: number;
  isEditable: boolean;
  onDiscountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReceivedAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TotalSection({ 
  discount, 
  totalAmount, 
  receivedAmount, 
  isEditable,
  onDiscountChange,
  onReceivedAmountChange
}: TotalSectionProps) {
  // Calculate the gross amount (before discount)
  const grossAmount = totalAmount + discount;
  
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div></div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="gross" className="mb-0">Gross Amount:</Label>
          <Input 
            id="gross" 
            className="h-9 w-32 text-right bg-gray-100" 
            type="number" 
            value={grossAmount} 
            readOnly 
            disabled
          />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="discount" className="mb-0">Discount Amount:</Label>
          <Input 
            id="discount" 
            className="h-9 w-32 text-right" 
            type="number" 
            value={discount} 
            onChange={onDiscountChange}
            disabled={!isEditable} 
            min="0"
            max={grossAmount}
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
        <div className="flex justify-between items-center">
          <Label htmlFor="balance" className="mb-0">Balance:</Label>
          <Input 
            id="balance" 
            className={`h-9 w-32 text-right ${totalAmount - receivedAmount > 0 ? 'bg-red-100' : 'bg-green-100'}`} 
            type="number" 
            value={totalAmount - receivedAmount} 
            readOnly 
            disabled
          />
        </div>
      </div>
    </div>
  );
}
