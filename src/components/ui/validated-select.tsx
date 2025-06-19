
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ValidatedSelectProps {
  value: string;
  onValueChange: (value: string, isValid: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options: { value: string; label: string }[];
  className?: string;
  showError?: boolean;
  errorMessage?: string;
}

export const ValidatedSelect: React.FC<ValidatedSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
  options,
  className,
  showError = true,
  errorMessage,
}) => {
  const [touched, setTouched] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const handleValueChange = (newValue: string) => {
    console.log("ValidatedSelect: Value changing from", value, "to", newValue);
    const isValid = !required || (newValue && newValue.trim() !== "");
    if (required && (!newValue || newValue.trim() === "")) {
      setError("This field is required");
    } else {
      setError("");
    }
    onValueChange(newValue, isValid);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTouched(true);
      if (required && (!value || value.trim() === "")) {
        setError("This field is required");
      }
    }
  };

  const shouldShowError = showError && touched && (error || errorMessage);

  return (
    <div className="w-full">
      <Select 
        value={value} 
        onValueChange={handleValueChange}
        onOpenChange={handleOpenChange}
        disabled={disabled}
      >
        <SelectTrigger 
          className={cn(
            className,
            shouldShowError && "border-red-500 focus:ring-red-500"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {shouldShowError && (
        <p className="text-sm text-red-500 mt-1">
          {errorMessage || error}
        </p>
      )}
    </div>
  );
};
