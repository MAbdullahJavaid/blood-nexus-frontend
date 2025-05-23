
import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { mockTests } from "./mock-data";

interface TestSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTestSelect: (testId: string) => void;
}

export function TestSearchModal({ isOpen, onOpenChange, onTestSelect }: TestSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tests, setTests] = useState(mockTests);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTests();
    }
  }, [isOpen]);

  const fetchTests = async (search?: string) => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('test_information')
        .select(`
          id,
          name,
          price,
          is_active
        `)
        .eq('is_active', true); // Only fetch active tests
      
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tests:', error);
        // Fallback to mock data if there's an error
        setTests(mockTests);
      } else if (data && data.length > 0) {
        // Map the database 'price' field to 'rate' for UI compatibility
        const mappedData = data.map(item => ({
          id: item.id,
          name: item.name,
          rate: item.price
        }));
        
        setTests(mappedData);
      } else {
        // Fallback to mock data if no results
        setTests(mockTests);
      }
    } catch (error) {
      console.error('Error:', error);
      setTests(mockTests);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTests(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Test</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Search tests by name" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSearch} variant="outline" size="icon">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-64 border mt-4 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : tests.length > 0 ? (
              tests.map(test => (
                <div 
                  key={test.id} 
                  className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => onTestSelect(test.id)}
                >
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600">
                    Rate: ${test.rate.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No tests found</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
