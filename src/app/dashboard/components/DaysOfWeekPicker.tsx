import { cn } from "@/lib/utils";
import React from "react";

interface DaysOfWeekPickerProps {
  daysOfWeek: number[];
  onChange: (daysOfWeek: number[]) => void;
}

const DaysOfWeekPicker: React.FC<DaysOfWeekPickerProps> = ({
  daysOfWeek,
  onChange,
}) => {
  // Adjusted order of days with Sunday as 0, Monday as 1, etc.
  const daysOfWeekLabels = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  // Map each label to its corresponding day number based on your requirement
  const dayMapping = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const handleDayClick = (day: number) => {
    if (daysOfWeek.includes(day)) {
      onChange(daysOfWeek.filter((d) => d !== day)); // Remove day if already selected
    } else {
      onChange([...daysOfWeek, day]); // Add day to selection
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {daysOfWeekLabels.map((label) => {
        const day = dayMapping[label as keyof typeof dayMapping]; // Get the corresponding number for each day
        const isSelected = daysOfWeek.includes(day);

        return (
          <div
            key={label}
            onClick={() => handleDayClick(day)}
            className={cn(
              "flex items-center justify-center w-9 text-sm h-9 rounded-full cursor-pointer select-none transition-colors duration-200",
              isSelected
                ? "bg-blue-500 text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default DaysOfWeekPicker;
