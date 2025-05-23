
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import TestSearchModal from './test-information/TestSearchModal';
import { TestInformation } from './test-information/types';

interface TestInformationFormProps {
  isEditable?: boolean;
  isSearchEnabled?: boolean;
  categories?: string[];
}

const TestInformationForm = ({ 
  isEditable = false, 
  isSearchEnabled = false
}: TestInformationFormProps) => {
  const [testId, setTestId] = useState<number | null>(null);
  const [testType, setTestType] = useState<'single' | 'full' | 'other'>('single');
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  
  // Define default values for the form fields
  const defaultValues = {
    testName: '',
    valueRemarks: '',
    remarks: '',
    measuringUnit: '',
    testRate: 600.00,
    active: true,
    categoryId: '',
    male: { lowValue: 0.00, highValue: 0.00 },
    female: { lowValue: 0.00, highValue: 0.00 },
    other: { lowValue: 0.00, highValue: 0.00 },
  };
  
  const [formValues, setFormValues] = useState(defaultValues);
  
  useEffect(() => {
    fetchCategories();
    fetchNextTestId();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('test_categories')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchNextTestId = async () => {
    try {
      // Get the max test_id from the test_information table using a count query
      const { count, error } = await supabase
        .from('test_information')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching test count:', error);
        return;
      }
      
      // Set the next test ID to count + 1 or 1 if no tests exist
      setTestId((count || 0) + 1);
    } catch (error) {
      console.error('Error calculating next test ID:', error);
    }
  };

  const handleSaveTest = async () => {
    if (!formValues.testName) {
      toast.error('Test name is required');
      return;
    }

    if (!formValues.categoryId) {
      toast.error('Category is required');
      return;
    }

    setLoading(true);

    try {
      // Prepare the metadata to store in the description JSON field
      const metadata = {
        type: testType,
        value_remarks: formValues.valueRemarks,
        remarks: formValues.remarks,
        measuring_unit: formValues.measuringUnit,
        male_low_value: formValues.male.lowValue,
        male_high_value: formValues.male.highValue,
        female_low_value: formValues.female.lowValue,
        female_high_value: formValues.female.highValue,
        other_low_value: formValues.other.lowValue,
        other_high_value: formValues.other.highValue,
        is_active: formValues.active // Store active status in the metadata
      };

      const testData = {
        name: formValues.testName,
        category_id: formValues.categoryId,
        price: formValues.testRate, // This is the database field name
        description: JSON.stringify(metadata) // Store metadata as JSON string
      };

      // Editing existing test
      if (currentTestId) {
        const { error } = await supabase
          .from('test_information')
          .update(testData)
          .eq('id', currentTestId);

        if (error) {
          console.error('Error updating test:', error);
          toast.error('Failed to update test');
          throw error;
        }
        
        toast.success('Test updated successfully');
      } 
      // Creating new test
      else {
        const { error, data } = await supabase
          .from('test_information')
          .insert(testData)
          .select();

        if (error) {
          console.error('Error creating test:', error);
          toast.error('Failed to save test');
          throw error;
        }
        
        toast.success('Test saved successfully');
        
        // Reset form and get next test ID
        resetForm();
        fetchNextTestId();
      }
    } catch (error) {
      console.error('Error saving test:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormValues(defaultValues);
    setCurrentTestId(null);
    setTestType('single');
  };

  const handleTestSelect = (test: TestInformation) => {
    setCurrentTestId(test.id);
    
    // We need to manually set the testId for display purposes
    // We'll fetch it separately since it's not in our type
    const fetchTestId = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_test_id_by_uuid', { test_uuid: test.id });
        
        if (error) {
          console.error('Error fetching test ID:', error);
        } else if (data) {
          setTestId(data);
        }
      } catch (error) {
        console.error('Error fetching test ID:', error);
      }
    };
    
    fetchTestId();
    
    // Parse the description field to get the test metadata
    let metadata: any = {};
    try {
      if (test.description) {
        metadata = JSON.parse(test.description);
      }
    } catch (e) {
      console.error("Error parsing test description:", e);
      metadata = {};
    }
    
    // Set test type from metadata or default to 'single'
    setTestType(metadata.type || 'single');
    
    // Map the database fields to our form
    setFormValues({
      testName: test.name,
      valueRemarks: metadata.value_remarks || '',
      remarks: metadata.remarks || '',
      measuringUnit: metadata.measuring_unit || '',
      testRate: test.price, // Use price from database 
      active: metadata.is_active !== false, // Consider active if not explicitly false
      categoryId: test.category_id,
      male: { 
        lowValue: metadata.male_low_value || 0, 
        highValue: metadata.male_high_value || 0
      },
      female: { 
        lowValue: metadata.female_low_value || 0, 
        highValue: metadata.female_high_value || 0 
      },
      other: { 
        lowValue: metadata.other_low_value || 0, 
        highValue: metadata.other_high_value || 0 
      },
    });
    setSearchModalOpen(false);
  };
  
  return (
    <>
      <Card className="border shadow-sm p-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="testId" className="w-20">Test ID:</Label>
            <div className="relative w-32">
              <Input 
                id="testId" 
                value={testId || ''} 
                readOnly 
                className="bg-green-100 pr-10" 
                disabled={!isEditable}
              />
              {isEditable && isSearchEnabled && (
                <Button 
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchModalOpen(true)}
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="category" className="w-20">Category:</Label>
            <Select 
              value={formValues.categoryId} 
              onValueChange={(value) => setFormValues({...formValues, categoryId: value})}
              disabled={!isEditable}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                {categories.length === 0 && (
                  <SelectItem value="none" disabled>
                    No categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="testName" className="w-20">Test Name:</Label>
              <Input 
                id="testName" 
                value={formValues.testName}
                onChange={(e) => setFormValues({...formValues, testName: e.target.value})}
                className="w-full" 
                disabled={!isEditable}
              />
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="flex items-start gap-2">
              <Label htmlFor="valueRemarks" className="w-20 mt-2">Value Remarks:</Label>
              <Textarea 
                id="valueRemarks" 
                value={formValues.valueRemarks}
                onChange={(e) => setFormValues({...formValues, valueRemarks: e.target.value})}
                className="h-24" 
                disabled={!isEditable}
              />
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="test" className="w-12">Test:</Label>
              <Select 
                value={testType} 
                onValueChange={(value) => setTestType(value as 'single' | 'full' | 'other')} 
                disabled={!isEditable}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="flex items-start gap-2">
              <Label htmlFor="remarks" className="w-20">Remarks:</Label>
              <Textarea 
                id="remarks" 
                value={formValues.remarks}
                onChange={(e) => setFormValues({...formValues, remarks: e.target.value})}
                className="h-24" 
                disabled={!isEditable}
              />
            </div>
          </div>
          
          {/* Male values section */}
          <div className="col-span-2 border p-2 rounded">
            <div className="font-medium mb-2">Male</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="maleLowValue" className="w-24">Low Value:</Label>
                <Input 
                  id="maleLowValue" 
                  type="number" 
                  step="0.01"
                  value={formValues.male.lowValue}
                  onChange={(e) => setFormValues({
                    ...formValues, 
                    male: {...formValues.male, lowValue: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full" 
                  disabled={!isEditable}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="maleHighValue" className="w-24">High Value:</Label>
                <Input 
                  id="maleHighValue" 
                  type="number" 
                  step="0.01"
                  value={formValues.male.highValue}
                  onChange={(e) => setFormValues({
                    ...formValues, 
                    male: {...formValues.male, highValue: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full" 
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
          
          {/* Female values section */}
          <div className="col-span-2 border p-2 rounded">
            <div className="font-medium mb-2">Female</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="femaleLowValue" className="w-24">Low Value:</Label>
                <Input 
                  id="femaleLowValue" 
                  type="number" 
                  step="0.01"
                  value={formValues.female.lowValue}
                  onChange={(e) => setFormValues({
                    ...formValues, 
                    female: {...formValues.female, lowValue: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full" 
                  disabled={!isEditable}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="femaleHighValue" className="w-24">High Value:</Label>
                <Input 
                  id="femaleHighValue" 
                  type="number" 
                  step="0.01"
                  value={formValues.female.highValue}
                  onChange={(e) => setFormValues({
                    ...formValues, 
                    female: {...formValues.female, highValue: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full" 
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
          
          {/* Other values section */}
          <div className="col-span-2 border p-2 rounded">
            <div className="font-medium mb-2">Other</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="otherLowValue" className="w-24">Low Value:</Label>
                <Input 
                  id="otherLowValue" 
                  type="number" 
                  step="0.01"
                  value={formValues.other.lowValue}
                  onChange={(e) => setFormValues({
                    ...formValues, 
                    other: {...formValues.other, lowValue: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full" 
                  disabled={!isEditable}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="otherHighValue" className="w-24">High Value:</Label>
                <Input 
                  id="otherHighValue" 
                  type="number" 
                  step="0.01"
                  value={formValues.other.highValue}
                  onChange={(e) => setFormValues({
                    ...formValues, 
                    other: {...formValues.other, highValue: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full" 
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="measuringUnit" className="w-28">Measuring Unit:</Label>
              <Input 
                id="measuringUnit" 
                value={formValues.measuringUnit}
                onChange={(e) => setFormValues({...formValues, measuringUnit: e.target.value})}
                className="w-32" 
                disabled={!isEditable}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="testRate" className="w-20">Test Rate:</Label>
              <Input 
                id="testRate" 
                type="number" 
                step="0.01"
                value={formValues.testRate}
                onChange={(e) => setFormValues({...formValues, testRate: parseFloat(e.target.value) || 0})}
                className="w-32" 
                disabled={!isEditable}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="active" className="w-16">Active:</Label>
              <Checkbox 
                id="active"
                checked={formValues.active}
                onCheckedChange={(checked) => setFormValues({...formValues, active: checked as boolean})}
                disabled={!isEditable}
              />
            </div>
          </div>

          {isEditable && (
            <div className="col-span-2 mt-4 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={resetForm}
                disabled={loading}
              >
                Clear
              </Button>
              <Button 
                onClick={handleSaveTest}
                disabled={loading || !formValues.testName || !formValues.categoryId}
              >
                {currentTestId ? 'Update' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      <TestSearchModal 
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={handleTestSelect}
      />
    </>
  );
};

export default TestInformationForm;
