
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
}

interface CategoryFormRef {
  clearForm: () => void;
  handleSave: () => Promise<{success: boolean, error?: any}>;
  handleDelete: () => Promise<{success: boolean, error?: any}>;
}

const CategoryForm = forwardRef<CategoryFormRef, CategoryFormProps>(
  ({ isSearchEnabled = false, isEditable = false }, ref) => {
    const [formData, setFormData] = useState({
      name: "",
      description: ""
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const clearForm = () => {
      setFormData({ name: "", description: "" });
      setSelectedCategory(null);
    };

    const handleSave = async () => {
      if (!formData.name.trim()) {
        throw new Error("Category name is required");
      }

      try {
        if (selectedCategory) {
          // Update existing category
          const { error } = await supabase
            .from('test_categories')
            .update({
              name: formData.name,
              description: formData.description
            })
            .eq('id', selectedCategory.id);

          if (error) throw error;
        } else {
          // Create new category
          const { error } = await supabase
            .from('test_categories')
            .insert({
              name: formData.name,
              description: formData.description
            });

          if (error) throw error;
        }

        clearForm();
        return { success: true };
      } catch (error) {
        console.error("Error saving category:", error);
        throw error;
      }
    };

    const handleDelete = async () => {
      if (!selectedCategory) {
        throw new Error("No category selected for deletion");
      }

      try {
        const { error } = await supabase
          .from('test_categories')
          .delete()
          .eq('id', selectedCategory.id);

        if (error) throw error;

        clearForm();
        return { success: true };
      } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
      }
    };

    useImperativeHandle(ref, () => ({
      clearForm,
      handleSave,
      handleDelete
    }));

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('test_categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    React.useEffect(() => {
      if (isSearchEnabled) {
        fetchCategories();
      }
    }, [isSearchEnabled]);

    const handleCategorySelect = (category: any) => {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ""
      });
    };

    return (
      <div className="bg-white p-4 rounded-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditable}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={!isEditable}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {isSearchEnabled && (
          <Card>
            <CardHeader>
              <CardTitle>Existing Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-2 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="font-medium">{category.name}</div>
                    {category.description && (
                      <div className="text-sm text-gray-600">{category.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

CategoryForm.displayName = "CategoryForm";

export default CategoryForm;
