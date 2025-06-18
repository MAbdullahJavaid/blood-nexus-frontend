
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestSearchModal } from "./test-information/TestSearchModal";

interface TestInformationFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
  categories?: string[];
}

interface TestInformationFormRef {
  clearForm: () => void;
  handleSave: () => Promise<{success: boolean, error?: any}>;
  handleDelete: () => Promise<{success: boolean, error?: any}>;
}

const TestInformationForm = forwardRef<TestInformationFormRef, TestInformationFormProps>(
  ({ isSearchEnabled = false, isEditable = false, categories = [] }, ref) => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      testType: "single"
    });
    const [testCategories, setTestCategories] = useState<any[]>([]);
    const [selectedTest, setSelectedTest] = useState<any>(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const clearForm = () => {
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        testType: "single"
      });
      setSelectedTest(null);
    };

    const handleSave = async () => {
      if (!formData.name.trim()) {
        throw new Error("Test name is required");
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error("Valid price is required");
      }

      try {
        const testData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category_id: formData.categoryId ? parseInt(formData.categoryId) : null,
          test_type: formData.testType
        };

        if (selectedTest) {
          // Update existing test
          const { error } = await supabase
            .from('test_information')
            .update(testData)
            .eq('id', selectedTest.id);

          if (error) throw error;
        } else {
          // Create new test
          const { error } = await supabase
            .from('test_information')
            .insert(testData);

          if (error) throw error;
        }

        clearForm();
        return { success: true };
      } catch (error) {
        console.error("Error saving test:", error);
        throw error;
      }
    };

    const handleDelete = async () => {
      if (!selectedTest) {
        throw new Error("No test selected for deletion");
      }

      try {
        const { error } = await supabase
          .from('test_information')
          .delete()
          .eq('id', selectedTest.id);

        if (error) throw error;

        clearForm();
        return { success: true };
      } catch (error) {
        console.error("Error deleting test:", error);
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
        setTestCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    React.useEffect(() => {
      fetchCategories();
    }, []);

    const handleTestSelect = (test: any) => {
      setSelectedTest(test);
      setFormData({
        name: test.name,
        description: test.description || "",
        price: test.price?.toString() || "",
        categoryId: test.category_id?.toString() || "",
        testType: test.test_type || "single"
      });
      setIsSearchModalOpen(false);
    };

    return (
      <div className="bg-white p-4 rounded-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Test Information
              {isSearchEnabled && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  Search Tests
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Test Name *</Label>
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

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={!isEditable}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                disabled={!isEditable}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {testCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="testType">Test Type</Label>
              <Select
                value={formData.testType}
                onValueChange={(value) => setFormData({ ...formData, testType: value })}
                disabled={!isEditable}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="package">Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TestSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onSelectTest={handleTestSelect}
        />
      </div>
    );
  }
);

TestInformationForm.displayName = "TestInformationForm";

export default TestInformationForm;
