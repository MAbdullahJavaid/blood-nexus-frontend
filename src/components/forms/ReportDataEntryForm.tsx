
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportDataEntryFormProps {
  isSearchEnabled?: boolean;
  isEditable?: boolean;
  isDeleting?: boolean;
}

interface ReportDataEntryFormRef {
  clearForm: () => void;
  handleSave: () => Promise<{success: boolean, error?: any}>;
  handleDelete: () => Promise<{success: boolean, error?: any}>;
}

const ReportDataEntryForm = forwardRef<ReportDataEntryFormRef, ReportDataEntryFormProps>(
  ({ isSearchEnabled = false, isEditable = false, isDeleting = false }, ref) => {
    const [formData, setFormData] = useState({
      documentNo: "",
      testName: "",
      userValue: "",
      lowValue: "",
      highValue: "",
      measuringUnit: "",
      category: "",
      lowFlag: false,
      highFlag: false,
      testId: ""
    });
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const clearForm = () => {
      setFormData({
        documentNo: "",
        testName: "",
        userValue: "",
        lowValue: "",
        highValue: "",
        measuringUnit: "",
        category: "",
        lowFlag: false,
        highFlag: false,
        testId: ""
      });
      setSelectedRecord(null);
    };

    const handleSave = async () => {
      if (!formData.documentNo.trim() || !formData.testName.trim()) {
        throw new Error("Document number and test name are required");
      }

      try {
        if (selectedRecord) {
          // Update existing record
          const { error } = await supabase
            .from('test_report_results')
            .update({
              document_no: formData.documentNo,
              test_name: formData.testName,
              user_value: formData.userValue,
              low_value: formData.lowValue,
              high_value: formData.highValue,
              measuring_unit: formData.measuringUnit,
              category: formData.category,
              low_flag: formData.lowFlag,
              high_flag: formData.highFlag,
              test_id: formData.testId ? parseInt(formData.testId) : null
            })
            .eq('id', selectedRecord.id);

          if (error) throw error;
        } else {
          // Create new record
          const { error } = await supabase
            .from('test_report_results')
            .insert({
              document_no: formData.documentNo,
              test_name: formData.testName,
              user_value: formData.userValue,
              low_value: formData.lowValue,
              high_value: formData.highValue,
              measuring_unit: formData.measuringUnit,
              category: formData.category,
              low_flag: formData.lowFlag,
              high_flag: formData.highFlag,
              test_id: formData.testId ? parseInt(formData.testId) : null
            });

          if (error) throw error;
        }

        clearForm();
        return { success: true };
      } catch (error) {
        console.error("Error saving report data:", error);
        throw error;
      }
    };

    const handleDelete = async () => {
      if (!selectedRecord) {
        throw new Error("No record selected for deletion");
      }

      try {
        const { error } = await supabase
          .from('test_report_results')
          .delete()
          .eq('id', selectedRecord.id);

        if (error) throw error;

        clearForm();
        return { success: true };
      } catch (error) {
        console.error("Error deleting report data:", error);
        throw error;
      }
    };

    useImperativeHandle(ref, () => ({
      clearForm,
      handleSave,
      handleDelete
    }));

    return (
      <div className="bg-white p-4 rounded-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Data Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentNo">Document Number *</Label>
                <Input
                  id="documentNo"
                  value={formData.documentNo}
                  onChange={(e) => setFormData({ ...formData, documentNo: e.target.value })}
                  disabled={!isEditable}
                  required
                />
              </div>

              <div>
                <Label htmlFor="testName">Test Name *</Label>
                <Input
                  id="testName"
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  disabled={!isEditable}
                  required
                />
              </div>

              <div>
                <Label htmlFor="userValue">User Value</Label>
                <Input
                  id="userValue"
                  value={formData.userValue}
                  onChange={(e) => setFormData({ ...formData, userValue: e.target.value })}
                  disabled={!isEditable}
                />
              </div>

              <div>
                <Label htmlFor="lowValue">Low Value</Label>
                <Input
                  id="lowValue"
                  value={formData.lowValue}
                  onChange={(e) => setFormData({ ...formData, lowValue: e.target.value })}
                  disabled={!isEditable}
                />
              </div>

              <div>
                <Label htmlFor="highValue">High Value</Label>
                <Input
                  id="highValue"
                  value={formData.highValue}
                  onChange={(e) => setFormData({ ...formData, highValue: e.target.value })}
                  disabled={!isEditable}
                />
              </div>

              <div>
                <Label htmlFor="measuringUnit">Measuring Unit</Label>
                <Input
                  id="measuringUnit"
                  value={formData.measuringUnit}
                  onChange={(e) => setFormData({ ...formData, measuringUnit: e.target.value })}
                  disabled={!isEditable}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={!isEditable}
                />
              </div>

              <div>
                <Label htmlFor="testId">Test ID</Label>
                <Input
                  id="testId"
                  type="number"
                  value={formData.testId}
                  onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                  disabled={!isEditable}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowFlag"
                  checked={formData.lowFlag}
                  onCheckedChange={(checked) => setFormData({ ...formData, lowFlag: !!checked })}
                  disabled={!isEditable}
                />
                <Label htmlFor="lowFlag">Low Flag</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="highFlag"
                  checked={formData.highFlag}
                  onCheckedChange={(checked) => setFormData({ ...formData, highFlag: !!checked })}
                  disabled={!isEditable}
                />
                <Label htmlFor="highFlag">High Flag</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

ReportDataEntryForm.displayName = "ReportDataEntryForm";

export default ReportDataEntryForm;
