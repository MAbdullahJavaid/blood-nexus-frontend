
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestResultsSectionProps {
  albumin: string;
  setAlbumin: (value: string) => void;
  saline: string;
  setSaline: (value: string) => void;
  coomb: string;
  setCoomb: (value: string) => void;
  result: string;
  setResult: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  remarks: string;
  setRemarks: (value: string) => void;
  isEditable: boolean;
}

export const TestResultsSection = ({
  albumin,
  setAlbumin,
  saline,
  setSaline,
  coomb,
  setCoomb,
  result,
  setResult,
  expiryDate,
  setExpiryDate,
  remarks,
  setRemarks,
  isEditable
}: TestResultsSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="albumin" className="mb-1 block">Albumin:</Label>
          <Select value={albumin} onValueChange={setAlbumin} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="nil">Nil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="saline" className="mb-1 block">Saline:</Label>
          <Select value={saline} onValueChange={setSaline} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="nil">Nil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="coomb" className="mb-1 block">Coomb:</Label>
          <Select value={coomb} onValueChange={setCoomb} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="nil">Nil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="result" className="mb-1 block">Result:</Label>
          <Select value={result} onValueChange={setResult} disabled={!isEditable}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compatible">Compatible</SelectItem>
              <SelectItem value="incompatible">Incompatible</SelectItem>
              <SelectItem value="not-performed">Not Performed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="expiryDate" className="mb-1 block">Expiry Date:</Label>
          <Input 
            id="expiryDate" 
            className="h-9" 
            type="date" 
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <Label htmlFor="remarks" className="mb-1 block">Remarks:</Label>
          <Input 
            id="remarks" 
            className="h-9" 
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={!isEditable} 
          />
        </div>
      </div>
    </>
  );
};
