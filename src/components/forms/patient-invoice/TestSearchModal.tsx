
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockTests } from "./mock-data";

interface TestSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTestSelect: (testId: string) => void;
}

export function TestSearchModal({ isOpen, onOpenChange, onTestSelect }: TestSearchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Test</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input placeholder="Search tests by name or ID" />
          <div className="h-64 border mt-4 overflow-y-auto">
            {mockTests.map(test => (
              <div 
                key={test.id} 
                className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => onTestSelect(test.id)}
              >
                <div className="font-medium">{test.name}</div>
                <div className="text-sm text-gray-600">
                  ID: {test.id}, Rate: ${test.rate.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
