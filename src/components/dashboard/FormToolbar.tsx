
import { 
  UserIcon, 
  DropletIcon, 
  TestTubeIcon, 
  FileInputIcon, 
  ReceiptIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function FormToolbar() {
  return (
    <div className="bg-white border-b border-border p-2 flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        className="form-button"
      >
        <UserIcon className="h-4 w-4" />
        <span>Donor</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
      >
        <DropletIcon className="h-4 w-4" />
        <span>Bleeding</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
      >
        <TestTubeIcon className="h-4 w-4" />
        <span>Crossmatch</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
      >
        <UserIcon className="h-4 w-4" />
        <span>Patient</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
      >
        <ReceiptIcon className="h-4 w-4" />
        <span>Patient Invoice</span>
      </Button>
    </div>
  );
}
