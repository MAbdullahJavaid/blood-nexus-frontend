
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
  onCloseClick?: () => void;
  onAddClick?: () => void;
  onCancelClick?: () => void;
  onSaveClick?: () => void;
  activeForm?: string;
  isEditing: boolean;
  isAdding: boolean;
}

export function CrudBar({ 
  onEditClick, 
  onCloseClick, 
  onAddClick,
  onCancelClick,
  onSaveClick,
  activeForm,
  isEditing,
  isAdding
}: CrudBarProps) {
  // Determine which buttons should be enabled
  const isFormActive = activeForm !== null;
  const isEditingOrAdding = isEditing || isAdding;
  const isPatientOrDonorForm = activeForm === 'patient' || activeForm === 'donor';
  
  return (
    <div className={cn(
      "bg-white border-b border-border p-2",
      "flex flex-wrap items-center justify-start gap-3"
    )}>
      <CrudButton 
        icon={PlusIcon} 
        label="Add" 
        onClick={onAddClick} 
        disabled={isEditingOrAdding}
      />
      <CrudButton 
        icon={PenIcon} 
        label="Edit" 
        onClick={onEditClick} 
        disabled={isEditingOrAdding || !isFormActive}
      />
      <CrudButton 
        icon={SearchIcon} 
        label="Retrieve" 
        disabled={isEditingOrAdding}
      />
      <CrudButton 
        icon={PlusIcon} 
        label="Add Item" 
        disabled={isEditingOrAdding}
      />
      <CrudButton 
        icon={TrashIcon} 
        label="Delete Item" 
        disabled={isEditingOrAdding}
      />
      <CrudButton 
        icon={SaveIcon} 
        label="Save" 
        onClick={onSaveClick}
        disabled={!isEditingOrAdding}
      />
      <CrudButton 
        icon={CircleXIcon} 
        label="Cancel" 
        onClick={onCancelClick}
        disabled={!isEditingOrAdding}
      />
      <CrudButton 
        icon={PrinterIcon} 
        label="Print" 
        disabled={isEditingOrAdding || isPatientOrDonorForm}
      />
      <CrudButton 
        icon={XIcon} 
        label="Close" 
        onClick={onCloseClick}
      />
    </div>
  );
}
