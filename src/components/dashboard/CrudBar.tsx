
import { 
  PlusIcon, 
  PenIcon, 
  SaveIcon, 
  PrinterIcon, 
  XIcon,
  SearchIcon,
  TrashIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

type CrudButtonProps = {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
};

const CrudButton = ({ icon: Icon, label, onClick }: CrudButtonProps) => (
  <button 
    className="crud-button"
    onClick={onClick}
  >
    <Icon className="h-5 w-5 text-gray-700" />
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export function CrudBar() {
  return (
    <div className={cn(
      "bg-white border-b border-border p-2",
      "flex flex-wrap items-center justify-start gap-3"
    )}>
      <CrudButton icon={PlusIcon} label="Add" />
      <CrudButton icon={PenIcon} label="Edit" />
      <CrudButton icon={SearchIcon} label="Retrieve" />
      <CrudButton icon={PlusIcon} label="Add Item" />
      <CrudButton icon={TrashIcon} label="Delete Item" />
      <CrudButton icon={SaveIcon} label="Save" />
      <CrudButton icon={PrinterIcon} label="Print" />
      <CrudButton icon={XIcon} label="Close" />
    </div>
  );
}
