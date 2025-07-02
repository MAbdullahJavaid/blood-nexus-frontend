
import { SearchIcon, TrashIcon } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { InvoiceItem } from "./types";

interface TestsSectionProps {
  items: InvoiceItem[];
  selectedItemIndex: number | null;
  isEditable: boolean;
  onSelectRow: (index: number) => void;
  onSearchTest: (index: number) => void;
  onQuantityChange: (index: number, value: number) => void;
  onRateChange: (index: number, value: number) => void;
  onDeleteRow?: (index: number) => void;
}

export function TestsSection({ 
  items, 
  selectedItemIndex, 
  isEditable, 
  onSelectRow, 
  onSearchTest,
  onQuantityChange,
  onRateChange,
  onDeleteRow 
}: TestsSectionProps) {
  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="font-semibold mb-3">Tests</h3>
      <div className="mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Test ID</TableHead>
              <TableHead>Test Name</TableHead>
              <TableHead className="w-[80px]">Qty</TableHead>
              <TableHead className="w-[100px]">Test Rate</TableHead>
              <TableHead className="w-[100px]">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
              {isEditable && onDeleteRow && <TableHead className="w-[50px]">Delete</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow 
                  key={item.id}
                  className={selectedItemIndex === index ? "bg-muted" : ""}
                  onClick={() => onSelectRow(index)}
                >
                  <TableCell>{item.testId}</TableCell>
                  <TableCell>{item.testName}</TableCell>
                  <TableCell>
                    {isEditable ? (
                      <Input
                        type="number"
                        min="1"
                        className="h-8 w-16"
                        value={item.qty}
                        onChange={(e) => onQuantityChange(index, parseInt(e.target.value) || 1)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      item.qty
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditable && item.testId ? (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="h-8 w-24"
                        value={item.rate}
                        onChange={(e) => onRateChange(index, parseFloat(e.target.value) || 0)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      item.rate.toFixed(2)
                    )}
                  </TableCell>
                  <TableCell>{item.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {!item.testId && isEditable && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSearchTest(index);
                        }}
                        className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                      >
                        <SearchIcon className="h-4 w-4" />
                      </button>
                    )}
                  </TableCell>
                  {isEditable && onDeleteRow && (
                    <TableCell>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRow(index);
                        }}
                        className="bg-red-200 p-1 rounded hover:bg-red-300"
                        title="Delete Row"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isEditable && onDeleteRow ? 7 : 6} className="text-center text-gray-500 h-24">
                  No items added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
