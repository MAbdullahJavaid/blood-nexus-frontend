
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockInvoices } from "./mock-data";

interface DocumentSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentSelect: (docNum: string) => void;
}

export function DocumentSearchModal({ isOpen, onOpenChange, onDocumentSelect }: DocumentSearchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Invoice</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input placeholder="Search by document number or patient name" />
          <div className="h-64 border mt-4 overflow-y-auto">
            {mockInvoices.map(invoice => (
              <div 
                key={invoice.documentNo} 
                className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => onDocumentSelect(invoice.documentNo)}
              >
                <div className="font-medium">Doc #: {invoice.documentNo}</div>
                <div className="text-sm text-gray-600">
                  Patient: {invoice.patientName}, Amount: ${invoice.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  Date: {invoice.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
