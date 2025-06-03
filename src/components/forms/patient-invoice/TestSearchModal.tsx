
import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Test } from './types';

interface TestSearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTestSelect: (testId: number) => void;
}

export function TestSearchModal({ isOpen, onOpenChange, onTestSelect }: TestSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tests, setTests] = useState<Test[]>([]);
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
          description
        `);
      
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      } else if (data && data.length > 0) {
        // Filter out inactive tests if description contains that info
        const activeTests = data.filter(item => {
          try {
            // Check if description is a valid JSON string
            if (item.description) {
              const parsedDescription = JSON.parse(item.description);
              return parsedDescription.is_active !== false; // If undefined or true, consider it active
            }
            return true; // If no description, consider it active
          } catch (e) {
            return true; // If parsing fails, consider it active
          }
        });
        
        // Map the database 'price' field to 'rate' for UI compatibility
        const mappedData = activeTests.map(item => ({
          id: item.id,
          name: item.name,
          rate: item.price
        }));
        
        setTests(mappedData);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setTests([]);
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
