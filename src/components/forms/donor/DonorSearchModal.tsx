
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useDonorForm } from "./DonorFormContext";
import { Donor } from "@/types/donor";

interface DonorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonorSearchModal = ({ isOpen, onClose }: DonorSearchModalProps) => {
  const { setDonorData } = useDonorForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchResults, setSearchResults] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load donors when component mounts or modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDonors();
    }
  }, [isOpen]);

  // Fetch donors from Supabase
  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('donors')
        .select('id, donor_id, name, blood_group, address, phone, email, gender, date_of_birth, last_donation_date');
      
      if (error) throw error;
      
      if (data) {
        setDonors(data);
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast({
        title: "Error",
        description: "Failed to load donors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search donors
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(donors);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = donors.filter(donor => 
      donor.donor_id.toLowerCase().includes(query) || 
      donor.name.toLowerCase().includes(query)
    );
    
    setSearchResults(filtered);
  };

  const handleDonorSelect = (donor: Donor) => {
    // Parse blood group
    const group = donor.blood_group?.replace(/[+-]/g, '') || 'B';
    const rh = donor.blood_group?.includes('+') ? '+ve' : donor.blood_group?.includes('-') ? '-ve' : '--';
    
    // Calculate age from date_of_birth if available
    const age = donor.date_of_birth 
      ? (new Date().getFullYear() - new Date(donor.date_of_birth).getFullYear()).toString() 
      : '';
    
    setDonorData({
      regNo: donor.donor_id || '',
      name: donor.name || '',
      date: donor.last_donation_date || new Date().toISOString().split('T')[0],
      address: donor.address || '',
      age,
      sex: donor.gender || 'male',
      group,
      rh,
      phoneRes: donor.phone || '',
      phoneOffice: '',
      remarks: '',
      status: false
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Donor</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Enter donor ID or name" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button 
              onClick={handleSearch} 
              variant="outline" 
              size="sm"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoading && (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blood"></div>
            </div>
          )}
          
          {!isLoading && (
            <div className="h-64 border mt-4 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? "No donors found matching your search." : "Enter a search term to find donors."}
                </div>
              ) : (
                searchResults.map(donor => (
                  <div 
                    key={donor.id} 
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDonorSelect(donor)}
                  >
                    <div className="font-medium">{donor.name}</div>
                    <div className="text-sm text-gray-600 flex justify-between">
                      <span>ID: {donor.donor_id}</span>
                      <span>Group: {donor.blood_group}</span>
                    </div>
                    {donor.phone && <div className="text-sm text-gray-600">Phone: {donor.phone}</div>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonorSearchModal;
