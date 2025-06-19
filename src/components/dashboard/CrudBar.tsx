
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
  loading?: boolean;
};

const CrudButton = ({ icon: Icon, label, onClick, disabled = false, loading = false }: CrudButtonProps) => (
  <button 
    className={cn(
      "flex flex-col items-center p-2 rounded-md transition-colors",
      disabled || loading ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
    )}
    onClick={onClick}
    disabled={disabled || loading}
  >
    <Icon className={cn("h-5 w-5 text-gray-700", loading && "animate-spin")} />
    <span className="text-xs mt-1">{loading ? "..." : label}</span>
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
  isSaving?: boolean;
  isDeletingRecord?: boolean;
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
  onlyPrintAndClose = false,
  isSaving = false,
  isDeletingRecord = false
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
        disabled={onlyPrintAndClose || isEditingOrAdding || isSaving || isDeletingRecord}
      />
      <CrudButton 
        icon={PenIcon} 
        label="Edit" 
        onClick={onEditClick} 
        disabled={onlyPrintAndClose || isEditingOrAdding || !isFormActive || isSaving || isDeletingRecord}
      />
      <CrudButton 
        icon={TrashIcon} 
        label="Delete" 
        onClick={onDeleteClick}
        disabled={onlyPrintAndClose || isEditingOrAdding || !isFormActive || isSaving || isDeletingRecord}
        loading={isDeletingRecord}
      />
      <CrudButton 
        icon={SearchIcon} 
        label="Retrieve" 
        disabled={onlyPrintAndClose || isEditingOrAdding || isSaving || isDeletingRecord}
      />
      <CrudButton 
        icon={PlusIcon} 
        label="Add Item" 
        onClick={onAddItemClick}
        disabled={onlyPrintAndClose || !isEditingOrAdding || !isPatientInvoiceForm || isSaving || isDeletingRecord}
      />
      <CrudButton 
        icon={TrashIcon} 
        label="Delete Item" 
        onClick={onDeleteItemClick}
        disabled={onlyPrintAndClose || !isEditingOrAdding || !isPatientInvoiceForm || isSaving || isDeletingRecord}
      />
      <CrudButton 
        icon={SaveIcon} 
        label="Save" 
        onClick={onSaveClick}
        disabled={onlyPrintAndClose || !isEditingOrAdding || isDeletingRecord}
        loading={isSaving}
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
          disabled={onlyPrintAndClose ? false : isEditingOrAdding || isSaving || isDeletingRecord}
        />
      )}
      <CrudButton 
        icon={XIcon} 
        label="Close" 
        onClick={onCloseClick}
        disabled={isSaving || isDeletingRecord}
      />
    </div>
  );
}
