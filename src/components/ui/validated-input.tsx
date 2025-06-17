
import * as React from "react";
import { cn } from "@/lib/utils";
import { validateField, ValidationRule, FieldValidationRules } from "@/lib/validation";

export interface ValidatedInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  validationType?: keyof typeof FieldValidationRules;
  customValidation?: ValidationRule;
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  showError?: boolean;
  errorMessage?: string;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ 
    className, 
    type = "text", 
    validationType, 
    customValidation, 
    value, 
    onChange, 
    showError = true,
    errorMessage,
    autoComplete = "off",
    ...props 
  }, ref) => {
    const [error, setError] = React.useState<string>("");
    const [touched, setTouched] = React.useState(false);

    const validationRules = React.useMemo(() => {
      if (customValidation) return customValidation;
      if (validationType) return FieldValidationRules[validationType];
      return {};
    }, [validationType, customValidation]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      // Validate the new value
      const result = validateField(newValue, validationRules);
      setError(result.message);
      
      // Call the parent onChange with the value and validation state
      onChange(newValue, result.isValid);
    };

    const handleBlur = () => {
      setTouched(true);
      // Re-validate on blur to show errors
      const result = validateField(value, validationRules);
      setError(result.message);
    };

    const shouldShowError = showError && touched && (error || errorMessage);

    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            shouldShowError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          {...props}
        />
        {shouldShowError && (
          <p className="text-sm text-red-500 mt-1">
            {errorMessage || error}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";

export { ValidatedInput };
