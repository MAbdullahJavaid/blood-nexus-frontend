
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface CrossmatchRecord {
  crossmatch_no: string;
  patient_name: string;
  date: string;
  blood_group: string;
  rh: string;
}

interface CrossmatchSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCrossmatchSelect: (crossmatchNo: string) => void;
}

export function CrossmatchSearchModal({
  isOpen,
  onOpenChange,
  onCrossmatchSelect,
}: CrossmatchSearchModalProps) {
  const [crossmatchRecords, setCrossmatchRecords] = useState<CrossmatchRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCrossmatchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crossmatch_records")
        .select("crossmatch_no, patient_name, date, blood_group, rh")
        .order("date", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching crossmatch records:", error);
        return;
      }

      setCrossmatchRecords(data || []);
    } catch (error) {
      console.error("Error fetching crossmatch records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCrossmatchRecords();
    }
  }, [isOpen]);

  const filteredRecords = crossmatchRecords.filter(
    (record) =>
      record.crossmatch_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCrossmatch = (crossmatchNo: string) => {
    onCrossmatchSelect(crossmatchNo);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Crossmatch Record</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Crossmatch Records</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search by crossmatch number or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-4">Loading crossmatch records...</div>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Crossmatch No</th>
                    <th className="px-4 py-2 text-left border-b">Patient Name</th>
                    <th className="px-4 py-2 text-left border-b">Date</th>
                    <th className="px-4 py-2 text-left border-b">Blood Group</th>
                    <th className="px-4 py-2 text-left border-b">RH</th>
                    <th className="px-4 py-2 text-left border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.crossmatch_no} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{record.crossmatch_no}</td>
                      <td className="px-4 py-2 border-b">{record.patient_name}</td>
                      <td className="px-4 py-2 border-b">{record.date}</td>
                      <td className="px-4 py-2 border-b">{record.blood_group || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">{record.rh || 'N/A'}</td>
                      <td className="px-4 py-2 border-b">
                        <Button
                          size="sm"
                          onClick={() => handleSelectCrossmatch(record.crossmatch_no)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRecords.length === 0 && !loading && (
                <div className="text-center py-4 text-gray-500">
                  No crossmatch records found.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
