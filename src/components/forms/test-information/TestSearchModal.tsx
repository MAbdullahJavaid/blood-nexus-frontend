
import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { TestInformation } from './types';

interface TestSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (test: TestInformation) => void;
}

const TestSearchModal = ({ isOpen, onClose, onSelect }: TestSearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tests, setTests] = useState<TestInformation[]>([]);
  const [loading, setLoading] = useState(false);
  const [testIds, setTestIds] = useState<{[key: number]: number}>({});

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
          *,
          category:test_categories(id, name)
        `);
      
      if (search && search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      } else if (data) {
        // Filter active tests and map the database fields
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
        
        // Map the database 'price' field to 'test_rate' for UI compatibility
        const mappedData = activeTests.map(item => ({
          ...item,
          test_rate: item.price // Add test_rate which maps to price
        }));
        
        setTests(mappedData as TestInformation[]);
        
        // For each test, fetch its sequential ID
        const ids: {[key: number]: number} = {};
        for (const test of data) {
          ids[test.id] = test.id; // Since id is now a number, we can use it directly
        }
        
        setTestIds(ids);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
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

  const getActiveStatus = (test: TestInformation): boolean => {
    try {
      if (test.description) {
        const parsedDescription = JSON.parse(test.description);
        return parsedDescription.is_active !== false;
      }
      return true;
    } catch (e) {
      return true;
    }
  };

  const handleTestSelect = (test: TestInformation) => {
    onSelect(test);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Tests</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4 flex-shrink-0">
          <Input 
            placeholder="Search by test name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSearch} variant="outline">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-[400px] border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[80px]">Test ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Rate</TableHead>
                  <TableHead className="w-[80px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : tests.length > 0 ? (
                  tests.map((test) => (
                    <TableRow 
                      key={test.id} 
                      className="cursor-pointer hover:bg-muted" 
                      onClick={() => handleTestSelect(test)}
                    >
                      <TableCell>{testIds[test.id] || test.id}</TableCell>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{test.category?.name || 'N/A'}</TableCell>
                      <TableCell>{test.test_type || 'single'}</TableCell>
                      <TableCell>${test.price?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          getActiveStatus(test) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getActiveStatus(test) ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No tests found matching your search' : 'No tests found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestSearchModal;
