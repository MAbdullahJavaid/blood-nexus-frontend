
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface ReportFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (fromCode: string, toCode: string) => void;
  title?: string;
  codeLabel?: string;
}

const ReportFilter = ({ 
  isOpen, 
  onClose, 
  onApplyFilter, 
  title = "Report Filter",
  codeLabel = "Code:"
}: ReportFilterProps) => {
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");

  const handleOK = () => {
    onApplyFilter(fromCode, toCode);
    onClose();
  };

  const handleCancel = () => {
    setFromCode("");
    setToCode("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-green-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Filter button */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Filter</span>
          </div>

          {/* Filter table */}
          <div className="border rounded-md overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-200">
              <div className="p-3 text-center font-medium border-r">Column</div>
              <div className="p-3 text-center font-medium border-r">From</div>
              <div className="p-3 text-center font-medium">To</div>
            </div>
            
            {/* Content row */}
            <div className="grid grid-cols-3 bg-white">
              <div className="p-3 border-r flex items-center">
                <Label className="text-sm">{codeLabel}</Label>
              </div>
              <div className="p-2 border-r">
                <Input
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="From"
                />
              </div>
              <div className="p-2">
                <Input
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOK}
              className="px-6"
            >
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportFilter;
