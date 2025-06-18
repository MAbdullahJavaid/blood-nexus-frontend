
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TestSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTest: (test: any) => void;
}

export const TestSearchModal: React.FC<TestSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTest,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTests = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('test_information')
        .select(`
          *,
          test_categories (
            name
          )
        `)
        .order('name');

      if (searchTerm.trim()) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTests();
    }
  }, [isOpen, searchTerm]);

  const handleTestSelect = (test: any) => {
    onSelectTest(test);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Tests</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search by test name</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter test name to search..."
            />
          </div>

          {loading ? (
            <div className="text-center py-4">Loading tests...</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTestSelect(test)}
                >
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600">
                    Price: ${test.price} | Type: {test.test_type}
                    {test.test_categories && (
                      <span> | Category: {test.test_categories.name}</span>
                    )}
                  </div>
                  {test.description && (
                    <div className="text-sm text-gray-500 mt-1">{test.description}</div>
                  )}
                </div>
              ))}
              
              {tests.length === 0 && !loading && (
                <div className="text-center py-4 text-gray-500">
                  No tests found
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestSearchModal;
