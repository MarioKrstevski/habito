import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicIcon } from "lucide-react/dynamic";
import * as LucideIcons from "lucide-react";
import { cn, isEmoji } from "@/lib/utils";

const icons = Object.keys(LucideIcons)
  .slice(0, 200)
  .filter((name) => !name.toLowerCase().includes("icon"))
  .filter((name) => !name.toLowerCase().includes("lucide"))
  .map((bigIconName) =>
    bigIconName
      .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // Handle "AArrowUp" -> "A-ArrowUp"
      .replace(/([a-z])([A-Z])/g, "$1-$2") // Handle "ArrowUp" -> "Arrow-Up"
      .replace(/([a-zA-Z])(\d)/g, "$1-$2") // Handle "Arrow1" -> "Arrow-1"
      .toLowerCase()
  );

interface HabitIconPickerProps {
  icon: string;
  onChange: (icon: string) => void;
}

export default function HabitIconPicker({
  icon,
  onChange,
}: HabitIconPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customEmoji, setCustomEmoji] = useState("");

  // Ensure only a single emoji is allowed
  const handleEmojiChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;
    if (value.length === 4) {
      value = value.slice(2);
    }
    if (isEmoji(value) || value === "") {
      setCustomEmoji(value);
      if (value) {
        onChange(value);
      } // Update selected icon if an emoji is added
    }
  };

  const handleEmojiFocus = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    let value = e.currentTarget.value;
    if (value.length === 4) {
      value = value.slice(2);
    }
    if (isEmoji(value) || value === "") {
      setCustomEmoji(value);
      if (value) {
        onChange(value);
      } // Update selected icon if an emoji is added
    }
  };

  const filteredIcons = icons.filter((icon) =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 border rounded-md mt-auto flex items-center gap-2 h-9">
          {icon ? (
            icons.includes(icon) ? (
              <DynamicIcon className="w-4 h-4" name={icon as any} />
            ) : (
              icon
            )
          ) : (
            <span>Select Icon</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 w-56 ">
        {/* Search Input & Emoji Input Side by Side */}
        <div className="flex gap-2 mb-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search icons"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-1 px-2 placeholder:px-1 border rounded w-full text-sm"
          />
          {/* Emoji Input */}
          <input
            type="text"
            placeholder="😀"
            value={icon.length === 2 ? icon : customEmoji}
            onChange={handleEmojiChange}
            onFocus={handleEmojiFocus}
            // maxLength={20} // Prevents multiple emoji input
            className={cn(
              "p-1 border rounded  w-12 text-center",
              icon.length === 2 &&
                "border-green-500 focus:border-green-500 "
            )}
          />
        </div>

        {/* Icon Grid */}
        <div className="flex flex-wrap gap-2 max-h-[214px] overflow-auto">
          {filteredIcons.map((name, idx) => (
            <div
              key={name + idx}
              onClick={() => onChange(name)}
              className={` ${name} cursor-pointer p-2 border rounded flex items-center justify-center ${
                icon === name
                  ? "border-green-500 "
                  : "hover:bg-gray-200"
              }`}
            >
              <DynamicIcon className="w-4 h-4" name={name as any} />
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
