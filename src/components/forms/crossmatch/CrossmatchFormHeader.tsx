
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";

interface CrossmatchFormHeaderProps {
  crossmatchNo: string;
  setCrossmatchNo: (value: string) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  date: string;
  setDate: (value: string) => void;
  isEditable: boolean;
  onSearchClick: () => void;
}

export const CrossmatchFormHeader = ({
  crossmatchNo,
  setCrossmatchNo,
  quantity,
  setQuantity,
  date,
  setDate,
  isEditable,
  onSearchClick
}: CrossmatchFormHeaderProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div>
        <Label htmlFor="caseNo" className="mb-1 block">Crossmatch No:</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="caseNo" 
            className="h-9" 
            disabled={!isEditable} 
            value={crossmatchNo}
            readOnly
            {/* onChange={(e) => setCrossmatchNo(e.target.value)} */}
          />
          {isEditable && (
            <div className="flex gap-1">
              <button 
                onClick={onSearchClick}
                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                aria-label="Search crossmatch"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="quantity" className="mb-1 block">Quantity:</Label>
        <Input 
          id="quantity" 
          className="h-9" 
          type="number" 
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          disabled={!isEditable} 
        />
      </div>
      <div>
        <Label htmlFor="date" className="mb-1 block">Date:</Label>
        <Input 
          id="date" 
          className="h-9" 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={!isEditable} 
        />
      </div>
    </div>
  );
};
