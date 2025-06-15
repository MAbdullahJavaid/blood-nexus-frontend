
import { 
  PlusIcon, 
  PenIcon, 
  SaveIcon, 
  PrinterIcon, 
  XIcon,
  SearchIcon,
  TrashIcon,
  CircleXIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

type CrudButtonProps = {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

const CrudButton = ({ icon: Icon, label, onClick, disabled = false }: CrudButtonProps) => (
  <button 
    className={cn(
      "flex flex-col items-center p-2 rounded-md",
      disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
    )}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="h-5 w-5 text-gray-700" />
    <span className="text-xs mt-1">{label}</span>
  </button>
);

interface CrudBarProps {
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onCloseClick?: () => void;
  onAddClick?: () => void;
  onCancelClick?: () => void;
  onSaveClick?: () => void;
  onAddItemClick?: () => void;
  onDeleteItemClick?: () => void;
  onPrintClick?: () => void;
  activeForm?: string;
  isEditing: boolean;
  isAdding: boolean;
  isDeleting?: boolean;
  onlyPrintAndClose?: boolean;
}

export function CrudBar({ 
  onEditClick, 
  onDeleteClick,
  onCloseClick, 
  onAddClick,
  onCancelClick,
  onSaveClick,
  onAddItemClick,
  onDeleteItemClick,
  onPrintClick,
  activeForm,
  isEditing,
  isAdding,
  isDeleting = false,
  onlyPrintAndClose = false
}: CrudBarProps) {
  // Determine which buttons should be enabled
  const isFormActive = activeForm !== null;
  const isEditingOrAdding = isEditing || isAdding || isDeleting;
  const isPrintHidden = activeForm === 'patient' || activeForm === 'donor' || 
                        activeForm === 'category' || activeForm === 'testInformation' || 
                        activeForm === 'bleeding';
  
  const isPatientInvoiceForm = activeForm === 'patientInvoice';

  // If in onlyPrintAndClose mode, only enable "Print" and "Close"
  return (
    <div className={cn(
      "bg-white border-b border-border p-2",
      "flex flex-wrap items-center justify-start gap-3"
    )}>
      <CrudButton 
        icon={PlusIcon} 
        label="Add" 
        onClick={onAddClick} 
        disabled={onlyPrintAndClose || isEditingOrAdding}
      />
      <CrudButton 
        icon={PenIcon} 
        label="Edit" 
        onClick={onEditClick} 
        disabled={onlyPrintAndClose || isEditingOrAdding || !isFormActive}
      />
      <CrudButton 
        icon={TrashIcon} 
        label="Delete" 
        onClick={onDeleteClick}
        disabled={onlyPrintAndClose || isEditingOrAdding || !isFormActive}
      />
      <CrudButton 
        icon={SearchIcon} 
        label="Retrieve" 
        disabled={onlyPrintAndClose || isEditingOrAdding}
      />
      <CrudButton 
        icon={PlusIcon} 
        label="Add Item" 
        onClick={onAddItemClick}
        disabled={onlyPrintAndClose || !isEditingOrAdding || !isPatientInvoiceForm}
      />
      <CrudButton 
        icon={TrashIcon} 
        label="Delete Item" 
        onClick={onDeleteItemClick}
        disabled={onlyPrintAndClose || !isEditingOrAdding || !isPatientInvoiceForm}
      />
      <CrudButton 
        icon={SaveIcon} 
        label="Save" 
        onClick={onSaveClick}
        disabled={onlyPrintAndClose || !isEditingOrAdding}
      />
      <CrudButton 
        icon={CircleXIcon} 
        label="Cancel" 
        onClick={onCancelClick}
        disabled={onlyPrintAndClose || !isEditingOrAdding}
      />
      {!isPrintHidden && (
        <CrudButton 
          icon={PrinterIcon} 
          label="Print" 
          onClick={onPrintClick}
          disabled={onlyPrintAndClose ? false : isEditingOrAdding}
        />
      )}
      <CrudButton 
        icon={XIcon} 
        label="Close" 
        onClick={onCloseClick}
        disabled={false}
      />
    </div>
  );
}

