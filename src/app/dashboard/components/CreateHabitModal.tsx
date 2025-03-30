"use client";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppState } from "@/hooks/useAppState";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { SelectWithInput } from "@/components/SelectWithInput";
import {
  Frequency,
  Habit,
  HabitType,
  HabitYearlyProgress,
  TimeOfDay,
} from "@prisma/client";
import {
  HabitWithParsedYearlyProgress,
  HabitWithYearlyProgress,
  ParsedHabitYearlyProgress,
} from "@/types/habits";
import { useUser } from "@clerk/nextjs";
import HabitIconPicker from "./HabitIconPicker";
import { Switch } from "@/components/ui/switch";
import DaysOfWeekPicker from "./DaysOfWeekPicker";
import TagsSelection from "./TagsSelection";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";

export default function CreateHabitModal() {
  const { user } = useUser();
  const { tags: tagsFromAppState } = useAppState();
  const {
    isCreateHabitModalOpen,
    habits,
    setHabits,
    setIsCreateHabitModalOpen,
  } = useAppState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("DAILY");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("ANY");
  const [type, setType] = useState<HabitType>("BUILD");
  const [overflow, setOverflow] = useState(false);

  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [metric, setMetric] = useState("times");
  const [targetCount, setTargetCount] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [tags, setTags] = useState<string[]>(() => {
    if (tagsFromAppState) {
      return tagsFromAppState;
    }
    return [];
  });

  // tODO
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (!title) {
      document.getElementById("title")?.focus();
      return;
    }
    console.log(startDate);
    if (!startDate) {
      const startDateInput = document.getElementById(
        "startDate"
      ) as HTMLInputElement;
      console.log(startDateInput);
      startDateInput.focus();
      startDateInput.style.borderColor = "red";
      return;
    }

    // Handle save logic here
    console.log({
      title,
      description,
      icon,
      targetCount,
      metric,
      daysOfWeek,
      timeOfDay,
      type,
      frequency,
      overflow,
      startDate,
    });

    const newHabit = await fetch("/api/habit", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
        frequency: frequency.toUpperCase() as Frequency,
        timeOfDay: timeOfDay,
        type: type,
        targetCount: targetCount,
        metric: metric,
        startDate: startDate,
        endDate: null,
        overflow: overflow,
      }),
    }).then((res) => res.json());
    const newHabits = [...habits, newHabit];
    setHabits(newHabits);
    setIsCreateHabitModalOpen(false);
  };
  const frequencyOptions = [
    { label: "Daily", value: "DAILY" },
    { label: "Weekly", value: "WEEKLY" },
    { label: "Monthly", value: "MONTHLY" },
  ];
  const timeOfDayOptions = [
    { label: "Any Time", value: "ANY" },
    { label: "Morning", value: "MORNING" },
    { label: "Afternoon", value: "AFTERNOON" },
    { label: "Evening", value: "EVENING" },
  ];
  const habitTypeOptions = [
    { label: "Build", value: "BUILD" },
    { label: "Break", value: "BREAK" },
  ];
  return (
    <Modal
      className="py-2 px-4 gap-2 border-none"
      title="New Habit"
      innerScroll
      isOpen={isCreateHabitModalOpen}
      footerJSX={
        <>
          {/* Action Buttons */}
          <div className="flex justify-end ">
            <Button
              onClick={() => {
                setIsCreateHabitModalOpen(false);
                console.log("closed");
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="ml-2"
              variant="default"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </>
      }
      onClose={() => setIsCreateHabitModalOpen(false)}
    >
      <form onSubmit={handleSave} className="py-1">
        <div className="p-2 text-sm">
          {/* Name & Icon */}
          <div className="flex flex-row items-center gap-2 mb-4">
            <div className="grow">
              <Label htmlFor="title" className="text-sm font-medium">
                Habit Name
              </Label>
              <Input
                required
                name="title"
                id="title"
                className="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                required
                name="type"
                value={type}
                onValueChange={(value) => setType(value as HabitType)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    {habitTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <HabitIconPicker
              icon={icon}
              onChange={(value) => setIcon(value)}
            />
          </div>
          {/* Goal & Frequency */}
          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="targetCount">Goal</Label>
            <div className="flex gap-2">
              <Input
                required
                name="targetCount"
                id="targetCount"
                type="number"
                className="w-full max-w-[80px]"
                value={targetCount}
                onChange={(e) =>
                  setTargetCount(Number(e.target.value))
                }
              />

              <SelectWithInput
                value={metric}
                placeholder="Custom: steps/reps/km"
                onChange={setMetric}
                options={[
                  { label: "Times", value: "times" },
                  { label: "Minutes", value: "minutes" },
                  { label: "Hours", value: "hours" },
                ]}
              />

              <Select
                value={frequency}
                onValueChange={(value) =>
                  setFrequency(value as Frequency)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Repeat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Repeat Options</SelectLabel>
                    {frequencyOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* Overflow */}
              <div className="flex flex-row gap-2 items-center">
                <Switch
                  id="overflow"
                  checked={overflow}
                  onCheckedChange={setOverflow}
                />
                <Label htmlFor="overflow">Overflow</Label>
              </div>
            </div>
          </div>
          {/* Time of Day & Start Date */}
          <div className="flex gap-2 mb-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="timeOfDay">Time of Day</Label>
              <Select
                required
                name="timeOfDay"
                value={timeOfDay}
                onValueChange={(value) =>
                  setTimeOfDay(value as TimeOfDay)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Time of Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Time of Day</SelectLabel>
                    {timeOfDayOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}
                    className={cn(
                      "w-fit min-w-[130px] pl-3 text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? (
                      formatDate(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    required
                    mode="single"
                    selected={startDate ?? undefined}
                    onSelect={(day) => {
                      setStartDate(day ?? null);
                      setIsOpen(false);
                      const startDateInput = document.getElementById(
                        "startDate"
                      ) as HTMLInputElement;
                      startDateInput.style.borderColor = "#DDD";
                    }}
                    disabled={(date) =>
                      date > new Date() ||
                      date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant={"outline"}
                    className={cn(
                      "w-fit min-w-[130px] pl-3 text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? (
                      formatDate(endDate, "PPP")
                    ) : (
                      <span>No end date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    required
                    mode="single"
                    selected={endDate ?? undefined}
                    onSelect={(day) => {
                      setEndDate(day ?? null);
                      setIsOpen(false);
                      const endDateInput = document.getElementById(
                        "endDate"
                      ) as HTMLInputElement;
                      endDateInput.style.borderColor = "#DDD";
                    }}
                    disabled={(date) =>
                      date > new Date() ||
                      date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              {endDate && (
                <Button
                  variant="ghost"
                  className="ml-2"
                  onClick={() => setEndDate(null)}
                >
                  X
                </Button>
              )}
            </div>
          </div>

          {/* More Options */}
          <Collapsible>
            <CollapsibleTrigger
              asChild
              className="text-blue-500 underline"
            >
              <Button className="w-full" variant={"outline"}>
                More Options
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2">
              {/* Days of the Week */}
              <div className="mb-4">
                <DaysOfWeekPicker
                  daysOfWeek={daysOfWeek}
                  onChange={setDaysOfWeek}
                />
              </div>
              {/* Tags */}
              <div className="mb-4">
                <TagsSelection tags={tags} onChange={setTags} />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 mb-4">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium"
                >
                  Description
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  className="w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </form>
    </Modal>
  );
}
