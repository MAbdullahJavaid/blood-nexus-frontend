
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DonorPatientValues, TestResults } from "./types";

interface ScreeningResultsPanelProps {
  donorPatientValues: DonorPatientValues;
  results: TestResults;
  isEditable: boolean;
  onValueChange: (test: keyof DonorPatientValues, value: string) => void;
}

const ScreeningResultsPanel = ({
  donorPatientValues,
  results,
  isEditable,
  onValueChange,
}: ScreeningResultsPanelProps) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* HBsAg (Hepatitis B) */}
      <div className="border p-3 rounded-md">
        <div className="text-red-600 font-medium mb-2">HBsAg (Hepatitis B)</div>
        <div className="grid grid-cols-2 gap-2">
          <Label htmlFor="hepBValue" className="mb-1 block">Donor/Patient Value:</Label>
          <Input 
            id="hepBValue" 
            className="h-8"
            value={donorPatientValues.hepB}
            onChange={(e) => onValueChange("hepB", e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Label className="mb-1 block">Cut Off Value:</Label>
          <Input value="1.00" className="h-8 bg-gray-50" readOnly />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Label className="mb-1 block">Result:</Label>
          <Input 
            value={results.hepB} 
            className={cn(
              "h-8 bg-gray-50",
              results.hepB === "REACTIVE" ? "text-red-600 font-medium" : 
              results.hepB === "Border Line REACTIVE" ? "text-orange-500 font-medium" : 
              "text-green-600 font-medium"
            )}
            readOnly 
          />
        </div>
      </div>

      {/* Anti - HCV (Hepatitis C) */}
      <div className="border p-3 rounded-md">
        <div className="text-red-600 font-medium mb-2">Anti - HCV (Hepatitis C)</div>
        <div className="grid grid-cols-2 gap-2">
          <Label htmlFor="hepCValue" className="mb-1 block">Donor/Patient Value:</Label>
          <Input 
            id="hepCValue" 
            className="h-8"
            value={donorPatientValues.hepC}
            onChange={(e) => onValueChange("hepC", e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Label className="mb-1 block">Cut Off Value:</Label>
          <Input value="1.00" className="h-8 bg-gray-50" readOnly />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Label className="mb-1 block">Result:</Label>
          <Input 
            value={results.hepC} 
            className={cn(
              "h-8 bg-gray-50",
              results.hepC === "REACTIVE" ? "text-red-600 font-medium" : 
              results.hepC === "Border Line REACTIVE" ? "text-orange-500 font-medium" : 
              "text-green-600 font-medium"
            )}
            readOnly 
          />
        </div>
      </div>

      {/* Anti - HIV */}
      <div className="border p-3 rounded-md">
        <div className="text-red-600 font-medium mb-2">Anti - HIV</div>
        <div className="grid grid-cols-2 gap-2">
          <Label htmlFor="hivValue" className="mb-1 block">Donor/Patient Value:</Label>
          <Input 
            id="hivValue" 
            className="h-8"
            value={donorPatientValues.hiv}
            onChange={(e) => onValueChange("hiv", e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Label className="mb-1 block">Cut Off Value:</Label>
          <Input value="1.00" className="h-8 bg-gray-50" readOnly />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Label className="mb-1 block">Result:</Label>
          <Input 
            value={results.hiv} 
            className={cn(
              "h-8 bg-gray-50",
              results.hiv === "REACTIVE" ? "text-red-600 font-medium" : 
              results.hiv === "Border Line REACTIVE" ? "text-orange-500 font-medium" : 
              "text-green-600 font-medium"
            )}
            readOnly 
          />
        </div>
      </div>

      {/* V.D.R.L (Syphilis) */}
      <div className="border p-3 rounded-md">
        <div className="text-red-600 font-medium mb-2">V.D.R.L (Syphilis)</div>
        <div className="grid grid-cols-2 gap-2">
          <Label htmlFor="vdrlValue" className="mb-1 block">Donor/Patient Value:</Label>
          <Input 
            id="vdrlValue" 
            className="h-8"
            value={donorPatientValues.vdrl}
            onChange={(e) => onValueChange("vdrl", e.target.value)}
            disabled={!isEditable} 
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Label className="mb-1 block">Cut Off Value:</Label>
          <Input value="1.00" className="h-8 bg-gray-50" readOnly />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Label className="mb-1 block">Result:</Label>
          <Input 
            value={results.vdrl} 
            className={cn(
              "h-8 bg-gray-50",
              results.vdrl === "REACTIVE" ? "text-red-600 font-medium" : 
              results.vdrl === "Border Line REACTIVE" ? "text-orange-500 font-medium" : 
              "text-green-600 font-medium"
            )}
            readOnly 
          />
        </div>
      </div>
    </div>
  );
};

export default ScreeningResultsPanel;
