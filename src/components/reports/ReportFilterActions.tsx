
import React from "react";
import { Button } from "@/components/ui/button";

interface ReportFilterActionsProps {
  onOk: () => void;
  onCancel: () => void;
  onExport: () => void;
  onExit: () => void;
}

export default function ReportFilterActions({
  onOk,
  onCancel,
  onExport,
  onExit,
}: ReportFilterActionsProps) {
  return (
    <div className="flex justify-center gap-4 pt-8">
      <Button
        onClick={onOk}
        className="px-8 bg-red-600 hover:bg-red-700 text-white"
        type="button"
      >
        OK
      </Button>
      <Button
        variant="outline"
        onClick={onCancel}
        className="px-8 border-gray-400 text-gray-700 hover:bg-gray-50"
        type="button"
      >
        Cancel
      </Button>
      <Button
        onClick={onExport}
        className="px-8 bg-green-600 hover:bg-green-700 text-white"
        type="button"
      >
        Export
      </Button>
      <Button
        variant="outline"
        onClick={onExit}
        className="px-8 border-gray-400 text-gray-700 hover:bg-gray-50"
        type="button"
      >
        Exit
      </Button>
    </div>
  );
}
