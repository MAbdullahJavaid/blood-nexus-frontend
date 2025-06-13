
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DonorRecord {
  id: string;
  donor_id: string;
  bleeding_date: string;
  donors: {
    id: string;
    donor_id: string;
    name: string;
    phone?: string;
    blood_group_separate?: string;
    rh_factor?: string;
  };
}

interface DonorScreeningSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (donorIds: string[]) => void;
}

const DonorScreeningSearchModal = ({ isOpen, onClose, onSelect }: DonorScreeningSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [donorRecords, setDonorRecords] = useState<DonorRecord[]>([]);
  const [searchResults, setSearchResults] = useState<DonorRecord[]>([]);
  const [selectedDonorIds, setSelectedDonorIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDonorRecords();
    }
  }, [isOpen]);

  const fetchDonorRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bleeding_records')
        .select(`
          id,
          donor_id,
          bleeding_date,
          donors!inner (
            id,
            donor_id,
            name,
            phone,
            blood_group_separate,
            rh_factor
          )
        `)
        .order('bleeding_date', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setDonorRecords(data);
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error fetching donor records:', error);
      toast({
        title: "Error",
        description: "Failed to load donor records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(donorRecords);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = donorRecords.filter(record => 
      record.donors.donor_id.toLowerCase().includes(query) || 
      record.donors.name.toLowerCase().includes(query) ||
      record.donors.phone?.toLowerCase().includes(query)
    );
    
    setSearchResults(filtered);
  };

  const handleDonorToggle = (donorId: string) => {
    setSelectedDonorIds(prev => 
      prev.includes(donorId) 
        ? prev.filter(id => id !== donorId)
        : [...prev, donorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDonorIds.length === searchResults.length) {
      setSelectedDonorIds([]);
    } else {
      setSelectedDonorIds(searchResults.map(record => record.donor_id));
    }
  };

  const handleConfirmSelection = () => {
    onSelect(selectedDonorIds);
    onClose();
    setSelectedDonorIds([]);
  };

  const handleClose = () => {
    onClose();
    setSelectedDonorIds([]);
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Donors from Bleeding Records</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Search by donor ID, name, or phone" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button onClick={handleSearch} variant="outline" size="sm">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleSelectAll}
              variant="outline"
              size="sm"
              disabled={searchResults.length === 0}
            >
              {selectedDonorIds.length === searchResults.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-gray-600">
              Selected: {selectedDonorIds.length} / {searchResults.length}
            </span>
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          {!isLoading && (
            <div className="flex-1 border rounded overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? "No donors found matching your search." : "No bleeding records found."}
                </div>
              ) : (
                <div className="divide-y">
                  {searchResults.map(record => (
                    <div 
                      key={record.id} 
                      className="p-3 hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <Checkbox
                        checked={selectedDonorIds.includes(record.donor_id)}
                        onCheckedChange={() => handleDonorToggle(record.donor_id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{record.donors.name}</div>
                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                          <span>ID: {record.donors.donor_id}</span>
                          <span>Blood Group: {record.donors.blood_group_separate}{record.donors.rh_factor}</span>
                          <span>Bleeding Date: {new Date(record.bleeding_date).toLocaleDateString()}</span>
                          {record.donors.phone && <span>Phone: {record.donors.phone}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSelection}
              disabled={selectedDonorIds.length === 0}
            >
              Select {selectedDonorIds.length} Donor(s)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonorScreeningSearchModal;
