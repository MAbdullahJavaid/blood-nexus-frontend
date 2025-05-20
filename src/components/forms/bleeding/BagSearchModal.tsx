
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface BagSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bagId: string) => void;
}

const BagSearchModal = ({ isOpen, onClose, onSelect }: BagSearchModalProps) => {
  // Example bag numbers - in a real app, this would be populated from backend
  const bagIds = ['B12345', 'B23456', 'B34567', 'B45678'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Bag Number</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input placeholder="Enter bag number" />
          <div className="h-64 border mt-4 overflow-y-auto">
            {bagIds.map(bagId => (
              <div 
                key={bagId} 
                className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(bagId);
                  onClose();
                }}
              >
                <div className="font-medium">Bag ID: {bagId}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BagSearchModal;
