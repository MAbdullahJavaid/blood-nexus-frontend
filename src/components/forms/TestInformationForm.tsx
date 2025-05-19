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

interface TestInformationFormProps {
  isEditable?: boolean;
  isSearchEnabled?: boolean;
  categories?: string[];
}

const TestInformationForm = ({ 
  isEditable = false, 
  isSearchEnabled = false,
  categories = [] 
}: TestInformationFormProps) => {
  const [testId, setTestId] = useState(1);
  const [testType, setTestType] = useState<'single' | 'full'>('single');
  
  // Define default values for the form fields
  const defaultValues = {
    testName: '',
    valueRemarks: '',
    remarks: '',
    measuringUnit: '',
    testRate: 600.00,
    active: true,
    male: { lowValue: 0.00, highValue: 0.00 },
    female: { lowValue: 0.00, highValue: 0.00 },
    other: { lowValue: 0.00, highValue: 0.00 },
  };
  
  const [formValues, setFormValues] = useState(defaultValues);
  
  return (
    <Card className="border shadow-sm p-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="testId" className="w-20">Test ID:</Label>
          <Input 
            id="testId" 
            value={testId} 
            readOnly 
            className="bg-green-100 w-32" 
            disabled={!isEditable}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="category" className="w-20">Category:</Label>
          <Select disabled={!isEditable}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category, index) => (
                <SelectItem key={index} value={category}>
                  {category}
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
              onValueChange={(value) => setTestType(value as 'single' | 'full')} 
              disabled={!isEditable}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="full">Full</SelectItem>
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
                  male: {...formValues.male, lowValue: parseFloat(e.target.value)}
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
                  male: {...formValues.male, highValue: parseFloat(e.target.value)}
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
                  female: {...formValues.female, lowValue: parseFloat(e.target.value)}
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
                  female: {...formValues.female, highValue: parseFloat(e.target.value)}
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
                  other: {...formValues.other, lowValue: parseFloat(e.target.value)}
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
                  other: {...formValues.other, highValue: parseFloat(e.target.value)}
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
              onChange={(e) => setFormValues({...formValues, testRate: parseFloat(e.target.value)})}
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
      </div>
    </Card>
  );
};

export default TestInformationForm;
