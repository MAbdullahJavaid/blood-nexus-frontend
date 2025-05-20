
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBleedingForm } from "./BleedingFormContext";

interface ScreeningResultsPanelProps {
  isEditable: boolean;
}

const ScreeningResultsPanel = ({ isEditable }: ScreeningResultsPanelProps) => {
  const { donorPatientValues, results, handleDonorPatientValueChange } = useBleedingForm();

  const tests = [
    { id: "hepB", label: "HBsAg" },
    { id: "hepC", label: "HCV" },
    { id: "hiv", label: "HIV" },
    { id: "vdrl", label: "VDRL" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {tests.map(test => {
        const testId = test.id as keyof typeof donorPatientValues;
        return (
          <div key={test.id} className="border p-3 rounded-md">
            <div className="text-red-600 font-medium mb-2">{test.label}</div>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <Label htmlFor={`${test.id}-value`} className="mb-1 block">Donor/Patient Value:</Label>
                <Input 
                  id={`${test.id}-value`} 
                  className="h-8"
                  value={donorPatientValues[testId]}
                  onChange={(e) => handleDonorPatientValueChange(testId, e.target.value)}
                  disabled={!isEditable}
                />
              </div>
              <div>
                <Label htmlFor={`${test.id}-result`} className="mb-1 block">Result:</Label>
                <Input 
                  id={`${test.id}-result`} 
                  className="h-8 bg-gray-50" 
                  value={results[testId as keyof typeof results]} 
                  readOnly 
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScreeningResultsPanel;
