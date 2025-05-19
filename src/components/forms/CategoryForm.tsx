
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

interface CategoryFormProps {
  isEditable?: boolean;
  isSearchEnabled?: boolean;
}

const CategoryForm = ({ isEditable = false, isSearchEnabled = false }: CategoryFormProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() && isEditable) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
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
            disabled={!isEditable}
          />
        </div>
      )}
      
      <ScrollArea className="h-[400px] border rounded-md">
        <div className="p-1">
          {categories.map((category, index) => (
            <div key={index} className="mb-2">
              <Input value={category} readOnly className="bg-gray-50" />
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center text-gray-400 p-4">
              No categories added yet.
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CategoryForm;
