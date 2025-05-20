
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BagData } from "./types";

interface BagSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bagId: string) => void;
}

const BagSearchModal = ({ isOpen, onClose, onSelect }: BagSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bags, setBags] = useState<BagData[]>([]);
  const [searchResults, setSearchResults] = useState<BagData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load bags when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchBags();
    }
  }, [isOpen]);

  // Fetch bags from Supabase
  const fetchBags = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bleeding_records')
        .select('id, bag_id, donor_id, bleeding_date, technician, remarks');
      
      if (error) throw error;
      
      if (data) {
        setBags(data as BagData[]);
        setSearchResults(data as BagData[]);
      }
    } catch (error) {
      console.error('Error fetching bags:', error);
      toast({
        title: "Error",
        description: "Failed to load blood bags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search bags
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(bags);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = bags.filter(bag => 
      bag.bag_id.toLowerCase().includes(query)
    );
    
    setSearchResults(filtered);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Blood Bag</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Enter Bag ID" 
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
                  {searchQuery ? "No bags found matching your search." : "Enter a search term to find blood bags."}
                </div>
              ) : (
                searchResults.map(bag => (
                  <div 
                    key={bag.id} 
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => onSelect(bag.bag_id)}
                  >
                    <div className="font-medium">Bag: {bag.bag_id}</div>
                    <div className="text-sm text-gray-600">
                      Donor ID: {bag.donor_id}
                    </div>
                    <div className="text-sm text-gray-600">
                      Date: {new Date(bag.bleeding_date).toLocaleDateString()}
                    </div>
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

export default BagSearchModal;
