
import { 
  UserIcon, 
  DropletIcon, 
  TestTubeIcon, 
  FileInputIcon, 
  ReceiptIcon,
  BeakerIcon,
  ListIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormToolbarProps {
  onButtonClick?: (formType: string) => void;
}

export function FormToolbar({ onButtonClick }: FormToolbarProps) {
  const handleButtonClick = (formType: string) => {
    if (onButtonClick) {
      onButtonClick(formType);
    }
  };

  return (
    <div className="bg-white border-b border-border p-2 flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        className="form-button"
        onClick={() => handleButtonClick('donor')}
      >
        <UserIcon className="h-4 w-4" />
        <span>Donor</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
        onClick={() => handleButtonClick('bleeding')}
      >
        <DropletIcon className="h-4 w-4" />
        <span>Bleeding</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
        onClick={() => handleButtonClick('crossmatch')}
      >
        <TestTubeIcon className="h-4 w-4" />
        <span>Crossmatch</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
        onClick={() => handleButtonClick('patient')}
      >
        <UserIcon className="h-4 w-4" />
        <span>Patient</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
        onClick={() => handleButtonClick('patientInvoice')}
      >
        <ReceiptIcon className="h-4 w-4" />
        <span>Patient Invoice</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
        onClick={() => handleButtonClick('testInformation')}
      >
        <BeakerIcon className="h-4 w-4" />
        <span>Test Info</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="form-button"
        onClick={() => handleButtonClick('category')}
      >
        <ListIcon className="h-4 w-4" />
        <span>Categories</span>
      </Button>
    </div>
  );
}
