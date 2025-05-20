
import { SearchIcon } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { InvoiceItem } from "./types";

interface TestsSectionProps {
  items: InvoiceItem[];
  selectedItemIndex: number | null;
  isEditable: boolean;
  onSelectRow: (index: number) => void;
  onSearchTest: (index: number) => void;
}

export function TestsSection({ 
  items, 
  selectedItemIndex, 
  isEditable, 
  onSelectRow, 
  onSearchTest 
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
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.rate.toFixed(2)}</TableCell>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 h-24">
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
