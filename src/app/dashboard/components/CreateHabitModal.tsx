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

export default function CreateHabitModal() {
  const { user } = useUser();
  const {
    isCreateHabitModalOpen,
    habits,
    setHabits,
    setIsCreateHabitModalOpen,
  } = useAppState();
  const [habitName, setHabitName] = useState("");
  const [goal, setGoal] = useState(1);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("ANY");
  const [type, setType] = useState<HabitType>("BUILD");
  const [repeat, setRepeat] = useState<Frequency>("DAILY");

  const [metric, setMetric] = useState("times");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [reminders, setReminders] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!habitName) {
      document.getElementById("habitName")?.focus();
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
      habitName,
      goal,
      timeOfDay,
      repeat,
      startDate,
      reminders,
    });

    // const hyp: ParsedHabitYearlyProgress[] = [
    //   {
    //     id: 1,

    //     year: new Date().getFullYear(),
    //     completions: Array.from({ length: 365 }, () =>
    //       Math.random() < 0.5 ? "0" : "1"
    //     ),
    //     habitId: 1,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ];
    // const habit: HabitWithParsedYearlyProgress = {
    //   type: "BUILD",
    //   icon: "🏃",
    //   timeOfDay: "ANY" as TimeOfDay,
    //   daysOfWeek: [],
    //   overflow: false,
    //   id: Math.floor(Math.random() * 1000) + 1,
    //   title: habitName,
    //   description: "",
    //   frequency: repeat.toUpperCase() as Frequency,
    //   metric: metric,
    //   targetCount: goal,
    //   startDate: startDate,
    //   endDate: null,
    //   isArchived: false,
    //   userId: Number(user?.id),
    //   createdAt: new Date(),
    //   tags: [],
    //   updatedAt: new Date(),
    //   habitYearlyProgress: hyp,
    // };
    const newHabit = await fetch("/api/habit", {
      method: "POST",
      body: JSON.stringify({
        title: habitName,
        description: "",
        frequency: repeat.toUpperCase() as Frequency,
        timeOfDay: timeOfDay,
        type: "BUILD",
        targetCount: goal,
        startDate: startDate,
        endDate: null,
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
  return (
    <Modal
      title="New Habit"
      isOpen={isCreateHabitModalOpen}
      onClose={() => setIsCreateHabitModalOpen(false)}
    >
      <form onSubmit={handleSave}>
        <div className="p-4">
          {/* Name & Icon */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="habitName"
              className="text-sm font-medium"
            >
              Habit Name
            </Label>
            <Input
              required
              name="habitName"
              id="habitName"
              className="w-full"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
            />
          </div>
          {/* Goal & Frequency */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="goal">Goal</Label>
              <div className="flex gap-2">
                <Input
                  required
                  name="goal"
                  id="goal"
                  type="number"
                  className="w-full max-w-[100px]"
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
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
                  value={repeat}
                  onValueChange={(value) =>
                    setRepeat(value as Frequency)
                  }
                >
                  <SelectTrigger className="w-[180px]">
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
              </div>
            </div>
          </div>

          <div className="flex gap-2">
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
                <SelectTrigger className="w-[180px]">
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
              <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                    //   initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => {
                setIsCreateHabitModalOpen(false);
                console.log("closed");
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="ml-2" variant="default">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
