
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShadcnDatePicker } from "@/components/ui/ShadcnDatePicker";

interface BloodDriveFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (date: string) => void;
}

const BloodDriveFilterModal: React.FC<BloodDriveFilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [date, setDate] = useState("");

  const handleClear = () => setDate("");

  const handleApply = () => {
    onApply(date);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Blood Drive Requests</DialogTitle>
          <DialogDescription>
            Filter requests by preferred date.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2 mb-4">
          <label className="text-sm font-medium" htmlFor="date-filter">Preferred Date</label>
          <ShadcnDatePicker
            value={date}
            onChange={setDate}
            placeholder="Select date"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleApply} disabled={!date}>
            Apply
          </Button>
          <Button variant="ghost" type="button" onClick={handleClear} disabled={!date}>
            Clear
          </Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BloodDriveFilterModal;
