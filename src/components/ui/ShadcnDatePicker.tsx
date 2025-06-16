import * as React from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ShadcnDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ShadcnDatePicker({
  value,
  onChange,
  disabled,
  placeholder = "Select date"
}: ShadcnDatePickerProps) {
  // Parse the string to Date (only if valid)
  let parsedDate: Date | undefined = undefined;
  if (value) {
    const tryParse = parse(value, "yyyy-MM-dd", new Date());
    if (!isNaN(tryParse.getTime())) parsedDate = tryParse;
  }
  
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Allow manual typing, validate, allow clearing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep date in "yyyy-MM-dd" format (or empty)
    const v = e.target.value;
    onChange(v);
  };

  // If calendar changes, update input in yyyy-MM-dd format
  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange("");
    } else {
      onChange(format(date, "yyyy-MM-dd"));
    }
    setOpen(false);
    // Focus back to the input for smooth UX
    inputRef.current?.focus();
  };

  return (
    <div className="flex gap-2 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-10 h-9 p-0 flex items-center justify-center",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
            mode="single" 
            selected={parsedDate} 
            onSelect={handleSelect} 
            initialFocus 
            className={cn("p-3 pointer-events-auto")} 
            disabled={disabled} 
            captionLayout="dropdown" 
            fromYear={1900} 
            toYear={new Date().getFullYear()} 
          />
        </PopoverContent>
      </Popover>
      <Input 
        ref={inputRef} 
        type="date" 
        value={value} 
        onChange={handleInputChange} 
        disabled={disabled} 
        placeholder={placeholder} 
        autoComplete="off" 
        className="h-9 flex-1" 
      />
    </div>
  );
}
