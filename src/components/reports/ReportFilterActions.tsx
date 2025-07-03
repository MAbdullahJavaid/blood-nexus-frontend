
import React from "react";
import { Button } from "@/components/ui/button";

interface ReportFilterActionsProps {
  onOk: () => void;
  onCancel: () => void;
  onExport: () => void;
  onExit: () => void;
  isLoading?: boolean;
  isExportDisabled?: boolean;
}

export default function ReportFilterActions({
  onOk,
  onCancel,
  onExport,
  onExit,
  isLoading = false,
  isExportDisabled = false,
}: ReportFilterActionsProps) {
  
  const handleOkClick = () => {
    console.log('ReportFilterActions - OK button clicked');
    onOk();
  };

  const handleCancelClick = () => {
    console.log('ReportFilterActions - Cancel button clicked');
    onCancel();
  };

  const handleExportClick = () => {
    console.log('ReportFilterActions - Export button clicked');
    onExport();
  };

  const handleExitClick = () => {
    console.log('ReportFilterActions - Exit button clicked');
    onExit();
  };

  return (
    <div className="flex justify-center gap-4 pt-8">
      <Button
        onClick={handleOkClick}
        className="px-8 bg-red-600 hover:bg-red-700 text-white"
        type="button"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "OK"}
      </Button>
      <Button
        variant="outline"
        onClick={handleCancelClick}
        className="px-8 border-gray-400 text-gray-700 hover:bg-gray-50"
        type="button"
      >
        Cancel
      </Button>
      <Button
        onClick={handleExportClick}
        className="px-8 bg-green-600 hover:bg-green-700 text-white"
        type="button"
        disabled={isExportDisabled}
      >
        Export
      </Button>
      <Button
        variant="outline"
        onClick={handleExitClick}
        className="px-8 border-gray-400 text-gray-700 hover:bg-gray-50"
        type="button"
      >
        Exit
      </Button>
    </div>
  );
}
