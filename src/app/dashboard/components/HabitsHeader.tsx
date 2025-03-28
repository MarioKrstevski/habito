"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";
import { DatePicker } from "./DatePicker";
import { useAppState } from "@/hooks/useAppState";
import CreateNewHabitButton from "@/components/CreateNewHabitButton";

interface HabitsHeaderProps {}
export default function HabitsHeader({}: HabitsHeaderProps) {
  const { setIsCreateHabitModalOpen } = useAppState();
  const [filter, setFilter] = useQueryState<string>(
    "filter",
    parseAsString.withDefault("all")
  );
  const [tag, setTag] = useQueryState<string>(
    "tag",
    parseAsString.withDefault("all")
  );

  let name = tag === "all" ? "All Habits" : tag;
  if (filter === "completed") {
    name = "Completed Habits";
  }
  if (filter === "unfinished") {
    name = "Unfinished Habits";
  }

  return (
    <header className="bg-background sticky top-0 z-10 border">
      <div className="h-16 flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="flex items-center space-x-4">
          <DatePicker />
          <Select>
            <SelectTrigger className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
              <SelectValue placeholder="My Habits Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order1">Order 1</SelectItem>
              <SelectItem value="order2">Order 2</SelectItem>
              {/* Add more options as needed */}
            </SelectContent>
          </Select>
          <CreateNewHabitButton label="+ Add Habit" />
        </div>
      </div>
    </header>
  );
}
