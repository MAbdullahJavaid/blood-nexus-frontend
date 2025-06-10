
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { DonorItem } from "./types";

interface DonorInfoTableProps {
  donorItems: DonorItem[];
  onAddDonor: () => void;
  onRemoveDonor: (donorId: string) => void;
  isEditable: boolean;
}

export const DonorInfoTable = ({
  donorItems,
  onAddDonor,
  onRemoveDonor,
  isEditable
}: DonorInfoTableProps) => {
  return (
    <div className="border rounded-md p-3 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">Donor Information</h3>
        {isEditable && (
          <Button 
            onClick={onAddDonor}
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Donor
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Bag No</TableHead>
            <TableHead className="w-[80px]">Pipe No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="w-[60px] text-right">Qty</TableHead>
            <TableHead className="w-[60px]">Unit</TableHead>
            {isEditable && <TableHead className="w-[80px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {donorItems.length > 0 ? (
            donorItems.map((donor) => (
              <TableRow key={donor.id}>
                <TableCell>{donor.bagNo}</TableCell>
                <TableCell>{donor.pipeNo}</TableCell>
                <TableCell>{donor.name}</TableCell>
                <TableCell>{donor.product}</TableCell>
                <TableCell className="text-right">{donor.quantity.toFixed(2)}</TableCell>
                <TableCell>{donor.unit}</TableCell>
                {isEditable && (
                  <TableCell>
                    <Button
                      onClick={() => onRemoveDonor(donor.id)}
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={isEditable ? 7 : 6} className="text-center py-4 text-gray-500">
                No donors added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
