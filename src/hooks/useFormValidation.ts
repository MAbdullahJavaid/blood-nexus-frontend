
import { useState, useCallback } from "react";
import { validateField, ValidationRule } from "@/lib/validation";

export interface FormField {
  value: string;
  isValid: boolean;
  error: string;
  touched: boolean;
}

export interface FormValidationConfig {
  [fieldName: string]: ValidationRule;
}

export const useFormValidation = (initialValues: Record<string, string>, validationConfig: FormValidationConfig) => {
  const [fields, setFields] = useState<Record<string, FormField>>(() => {
    const initialFields: Record<string, FormField> = {};
    Object.keys(initialValues).forEach(key => {
      initialFields[key] = {
        value: initialValues[key],
        isValid: true,
        error: "",
        touched: false,
      };
    });
    return initialFields;
  });

  const validateForm = useCallback(() => {
    const updatedFields = { ...fields };
    let isFormValid = true;

    Object.keys(validationConfig).forEach(fieldName => {
      const field = updatedFields[fieldName];
      if (field) {
        const result = validateField(field.value, validationConfig[fieldName]);
        updatedFields[fieldName] = {
          ...field,
          isValid: result.isValid,
          error: result.message,
          touched: true,
        };
        if (!result.isValid) {
          isFormValid = false;
        }
      }
    });

    setFields(updatedFields);
    return isFormValid;
  }, [fields, validationConfig]);

  const updateField = useCallback((fieldName: string, value: string, isValid: boolean = true) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        isValid,
        touched: true,
      }
    }));
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error,
        isValid: false,
        touched: true,
      }
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFields(prev => {
      const resetFields: Record<string, FormField> = {};
      Object.keys(prev).forEach(key => {
        resetFields[key] = {
          value: initialValues[key] || "",
          isValid: true,
          error: "",
          touched: false,
        };
      });
      return resetFields;
    });
  }, [initialValues]);

  const isFormValid = Object.values(fields).every(field => field.isValid);

  return {
    fields,
    updateField,
    setFieldError,
    validateForm,
    resetForm,
    isFormValid,
  };
};
