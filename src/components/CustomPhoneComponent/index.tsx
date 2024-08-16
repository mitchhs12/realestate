import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";

interface CustomPhoneInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({ className, ...props }) => {
  const handlePhoneChange = (value: string | undefined) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <PhoneInput
      {...props}
      onChange={handlePhoneChange}
      className={cn(
        "custom-phone-input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm shadow-secondary transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
};

export default CustomPhoneInput;
