
import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    
    let query = supabase
      .from('test_information')
      .select(`
        *,
        category:test_categories(id, name)
      `);
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    const { data, error } = await query;
    
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
    
    setLoading(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Tests</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Search by test name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleSearch} variant="outline">
            <SearchIcon className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
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
              {tests.length > 0 ? (
                tests.map((test) => (
                  <TableRow 
                    key={test.id} 
                    className="cursor-pointer hover:bg-muted" 
                    onClick={() => onSelect(test)}
                  >
                    <TableCell>{testIds[test.id] || '-'}</TableCell>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>{test.category?.name || 'N/A'}</TableCell>
                    <TableCell>{test.test_type || 'single'}</TableCell>
                    <TableCell>{test.price}</TableCell>
                    <TableCell>{getActiveStatus(test) ? 'Active' : 'Inactive'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {loading ? 'Loading...' : 'No tests found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestSearchModal;
