
// Core validation utility functions
export const ValidationPatterns = {
  name: /^[a-zA-Z\s.'-]+$/,
  phone: /^[0-9+\-\s()]+$/,
  regNo: /^[A-Z0-9]+$/,
  positiveNumber: /^\d*\.?\d+$/,
  integer: /^\d+$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/,
  address: /^[a-zA-Z0-9\s.,#\-']+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const ValidationMessages = {
  required: "This field is required",
  name: "Name should only contain letters, spaces, and common punctuation",
  phone: "Please enter a valid phone number",
  phoneLength: "Phone number must be 11 digits or less",
  regNo: "Registration number should only contain letters and numbers",
  positiveNumber: "Please enter a valid positive number",
  integer: "Please enter a valid whole number",
  alphanumeric: "Only letters and numbers are allowed",
  address: "Address contains invalid characters",
  email: "Please enter a valid email address",
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  range: (min: number, max: number) => `Value must be between ${min} and ${max}`,
} as const;

export interface ValidationRule {
  pattern?: RegExp;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  // Check required
  if (rules.required && (!value || value.trim() === "")) {
    return { isValid: false, message: ValidationMessages.required };
  }

  // If not required and empty, it's valid
  if (!rules.required && (!value || value.trim() === "")) {
    return { isValid: true, message: "" };
  }

  // Check length constraints
  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, message: ValidationMessages.minLength(rules.minLength) };
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, message: ValidationMessages.maxLength(rules.maxLength) };
  }

  // Check numeric range
  if (rules.min !== undefined || rules.max !== undefined) {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return { isValid: false, message: ValidationMessages.positiveNumber };
    }
    if (rules.min !== undefined && numValue < rules.min) {
      return { isValid: false, message: ValidationMessages.range(rules.min, rules.max || Infinity) };
    }
    if (rules.max !== undefined && numValue > rules.max) {
      return { isValid: false, message: ValidationMessages.range(rules.min || 0, rules.max) };
    }
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    // Return appropriate message based on pattern
    if (rules.pattern === ValidationPatterns.name) {
      return { isValid: false, message: ValidationMessages.name };
    }
    if (rules.pattern === ValidationPatterns.phone) {
      return { isValid: false, message: ValidationMessages.phone };
    }
    if (rules.pattern === ValidationPatterns.regNo) {
      return { isValid: false, message: ValidationMessages.regNo };
    }
    if (rules.pattern === ValidationPatterns.positiveNumber) {
      return { isValid: false, message: ValidationMessages.positiveNumber };
    }
    if (rules.pattern === ValidationPatterns.integer) {
      return { isValid: false, message: ValidationMessages.integer };
    }
    if (rules.pattern === ValidationPatterns.alphanumeric) {
      return { isValid: false, message: ValidationMessages.alphanumeric };
    }
    if (rules.pattern === ValidationPatterns.address) {
      return { isValid: false, message: ValidationMessages.address };
    }
    if (rules.pattern === ValidationPatterns.email) {
      return { isValid: false, message: ValidationMessages.email };
    }
    return { isValid: false, message: "Invalid format" };
  }

  // Custom validation
  if (rules.custom) {
    const customMessage = rules.custom(value);
    if (customMessage) {
      return { isValid: false, message: customMessage };
    }
  }

  return { isValid: true, message: "" };
};

// Predefined validation rules for common field types
export const FieldValidationRules = {
  name: {
    pattern: ValidationPatterns.name,
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  phone: {
    pattern: ValidationPatterns.phone,
    maxLength: 11,
  },
  regNo: {
    pattern: ValidationPatterns.regNo,
    required: true,
    minLength: 1,
    maxLength: 20,
  },
  age: {
    pattern: ValidationPatterns.integer,
    min: 0,
    max: 150,
  },
  weight: {
    pattern: ValidationPatterns.positiveNumber,
    min: 0,
    max: 1000,
  },
  address: {
    pattern: ValidationPatterns.address,
    maxLength: 500,
  },
  email: {
    pattern: ValidationPatterns.email,
    maxLength: 100,
  },
  amount: {
    pattern: ValidationPatterns.positiveNumber,
    min: 0,
  },
  quantity: {
    pattern: ValidationPatterns.integer,
    min: 1,
    max: 1000,
  },
} as const;
