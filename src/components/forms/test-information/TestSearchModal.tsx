
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
    } else if (data) {
      setTests(data as unknown as TestInformation[]);
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
                <TableHead className="w-[100px]">Rate</TableHead>
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
                    <TableCell>{test.test_id}</TableCell>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>{test.category?.name || 'N/A'}</TableCell>
                    <TableCell>{test.test_rate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
