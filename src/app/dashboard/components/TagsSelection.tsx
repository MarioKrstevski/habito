"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { TagIcon } from "lucide-react"; // Import TagIcon

interface TagsSelectionProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsSelection({
  tags: initialTags,
  onChange,
}: TagsSelectionProps) {
  const [newTag, setNewTag] = useState("");
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [allTags, setAllTags] = useState(initialTags);

  useEffect(() => {
    setAllTags(initialTags);
  }, [initialTags]);

  const handleAddTag = useCallback(() => {
    if (newTag && !selectedTags.includes(newTag)) {
      const updatedTags = [...selectedTags, newTag];
      setSelectedTags(updatedTags);
      onChange(updatedTags);
      setNewTag("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (!allTags.includes(newTag)) {
        setAllTags([...allTags, newTag]);
      }
    }
  }, [newTag, selectedTags, onChange, allTags]);

  const handleTagSelectionChange = useCallback(
    (tag: string) => {
      let updatedTags: string[];
      if (selectedTags.includes(tag)) {
        updatedTags = selectedTags.filter((t) => t !== tag);
      } else {
        updatedTags = [...selectedTags, tag];
      }
      setSelectedTags(updatedTags);
      onChange(updatedTags);
    },
    [selectedTags, onChange]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTag(e.target.value);
  };

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <TagIcon className="mr-2 h-4 w-4" />
          {selectedTags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            "Select or Add Tags"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <div className="flex items-center space-x-2 mb-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter new tag"
            value={newTag}
            onChange={handleInputChange}
          />
          <Button onClick={handleAddTag}>Add</Button>
        </div>
        <div className="max-h-[200px] overflow-y-auto rounded-md p-4">
          {allTags.map((tag) => (
            <div
              key={tag}
              className="relative flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleTagSelectionChange(tag)}
            >
              <Label htmlFor={tag} className="w-full">
                {tag}
              </Label>
              {selectedTags.includes(tag) && (
                <Check className="absolute right-2 text-blue-500" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
