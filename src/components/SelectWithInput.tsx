"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectWithInputProps {
  options: Option[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SelectWithInput({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  className,
}: SelectWithInputProps) {
  const [open, setOpen] = React.useState(false);
  const [customValue, setCustomValue] = React.useState("");
  const [isCustom, setIsCustom] = useState(false);
  const handleSelectChange = (newValue: string) => {
    if (!options.some((option) => option.value === newValue)) {
      setCustomValue(newValue);
    }
    onChange(newValue);
  };

  const handleCustomValueSubmit = () => {
    console.log("customValue setting");
    const newCustomValue = document.getElementById(
      "custom-value"
    ) as HTMLInputElement;

    setExtendedOptions([
      {
        value: newCustomValue.value,
        label:
          newCustomValue.value.charAt(0).toUpperCase() +
          newCustomValue.value.slice(1),
      },
      ...options,
    ]);

    onChange(newCustomValue.value);
    setTimeout(() => {
      handleSelectChange(newCustomValue.value);
    }, 100);
    setOpen(false);
    setIsCustom(false);
    // newCustomValue.value = "";
  };

  const [extendedOptions, setExtendedOptions] = useState(() => {
    if (value === "") {
      return options;
    }
    if (options.some((option) => option.value === value)) {
      return options;
    }
    return [
      {
        value: value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
      },
      ...options,
    ];
  });

  return (
    <div className={cn("relative", className)}>
      <Select
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>{value}</SelectValue>
        </SelectTrigger>
        <SelectContent
          onKeyDown={(e) => {
            if (isCustom) {
            }
          }}
        >
          {isCustom ? (
            <div className="flex items-center p-2 border-b">
              <Input
                id="custom-value"
                name="custom-value"
                placeholder={placeholder}
                className="flex-1 placeholder:text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCustomValueSubmit();
                  }
                  e.stopPropagation();
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCustomValueSubmit}
                className="ml-2"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCustom(true)}
            >
              Create custom
            </Button>
          )}
          <SelectGroup>
            {extendedOptions
              .filter((option) => option.value !== "")
              .map((option, idx) => (
                <SelectItem key={idx} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
