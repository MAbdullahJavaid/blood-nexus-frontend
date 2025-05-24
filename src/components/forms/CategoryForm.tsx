
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CategoryFormProps {
  isEditable?: boolean;
  isSearchEnabled?: boolean;
}

const CategoryForm = ({ isEditable = false, isSearchEnabled = false }: CategoryFormProps) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('test_categories')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() && isEditable) {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('test_categories')
        .insert({ name: newCategory.trim() })
        .select();
      
      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category');
      } else if (data) {
        setCategories([...categories, data[0]]);
        setNewCategory('');
        toast.success('Category added successfully');
      }
      
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <Card className="border shadow-sm p-4 max-w-md mx-auto">
      <div className="flex justify-center mb-2">
        <h2 className="text-xl font-medium">Category Name</h2>
      </div>
      
      {isEditable && (
        <div className="flex mb-4">
          <Input 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            className="mr-2"
            disabled={!isEditable || loading}
            placeholder="Enter new category name"
          />
          <Button 
            onClick={handleAddCategory} 
            disabled={!newCategory.trim() || loading}
          >
            Add
          </Button>
        </div>
      )}
      
      <ScrollArea className="h-[400px] border rounded-md">
        <div className="p-1">
          {loading && categories.length === 0 ? (
            <div className="text-center text-gray-400 p-4">
              Loading categories...
            </div>
          ) : (
            <>
              {categories.map((category) => (
                <div key={category.id} className="mb-2">
                  <Input value={category.name} readOnly className="bg-gray-50" />
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center text-gray-400 p-4">
                  No categories added yet.
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CategoryForm;
