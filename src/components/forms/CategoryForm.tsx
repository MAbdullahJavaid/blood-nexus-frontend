
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
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

interface FormRef {
  clearForm: () => void;
  handleSave?: () => Promise<{success: boolean, error?: any}>;
  handleDelete?: () => Promise<{success: boolean, error?: any}>;
}

const CategoryForm = forwardRef<FormRef, CategoryFormProps>(({ isEditable = false, isSearchEnabled = false }, ref) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useImperativeHandle(ref, () => ({
    clearForm: () => {
      setNewCategory('');
      setSelectedCategoryId(null);
    },
    handleDelete: async () => {
      if (!selectedCategoryId) {
        return { success: false, error: "No category selected" };
      }
      
      try {
        setLoading(true);
        const { error } = await supabase
          .from('test_categories')
          .delete()
          .eq('id', selectedCategoryId);
        
        if (error) {
          console.error("Error deleting category:", error);
          toast.error("Failed to delete category");
          return { success: false, error: error.message };
        }
        
        setCategories(categories.filter(cat => cat.id !== selectedCategoryId));
        setSelectedCategoryId(null);
        toast.success("Category deleted successfully");
        return { success: true };
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
        return { success: false, error: (error as any)?.message || "Unknown error" };
      } finally {
        setLoading(false);
      }
    }
  }));

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
                  <Input 
                    value={category.name} 
                    readOnly 
                    className={`bg-gray-50 cursor-pointer ${selectedCategoryId === category.id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSelectedCategoryId(category.id)}
                  />
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
});

CategoryForm.displayName = "CategoryForm";

export default CategoryForm;
