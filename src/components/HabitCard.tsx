"use client";

import { useState } from "react";
import { Habit, HabitYearlyProgress } from "@prisma/client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/useAppState";
import { HabitWithParsedYearlyProgress } from "@/types/habits";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { DynamicIcon } from "lucide-react/dynamic";
import { isEmoji } from "@/lib/utils";

interface HabitCardProps {
  habit: HabitWithParsedYearlyProgress;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const {
    habits,
    setHabits,
    setIsEditHabitModalOpen,
    setSelectedHabit,
  } = useAppState();
  const yearlyProgress = habit.yearlyProgress.find(
    (progress) => progress.year === new Date().getFullYear()
  );
  const [completions, setCompletions] = useState(
    yearlyProgress?.completions
      ? yearlyProgress.completions.map(Number)
      : []
  );
  const [customCompletionModalOpen, setCustomCompletionModalOpen] =
    useState(false);
  const [customCompletionInput, setCustomCompletionInput] =
    useState("");

  const handleIncrement = async () => {
    if (!yearlyProgress) return;
    const today = new Date();
    const dayOfYear = getDayOfYear(today);

    const newCompletions = [...completions];
    newCompletions[dayOfYear - 1] =
      (newCompletions[dayOfYear - 1] || 0) + 1;

    setCompletions(newCompletions);
    await updateYearlyProgress(newCompletions);
  };

  const handleCustomCompletion = async () => {
    if (!yearlyProgress) return;
    const today = new Date();
    const dayOfYear = getDayOfYear(today);

    const newCompletions = [...completions];
    newCompletions[dayOfYear - 1] = parseInt(customCompletionInput);
    setCompletions(newCompletions);
    await updateYearlyProgress(newCompletions);

    setCustomCompletionInput("");
    setCustomCompletionModalOpen(false);
  };

  const updateYearlyProgress = async (newCompletions: number[]) => {
    const updatedYearlyProgress = await fetch(`/api/habit/progress`, {
      method: "PATCH",
      body: JSON.stringify({
        hypID: yearlyProgress?.id,
        completions: newCompletions.join(","),
      }),
    }).then((res) => res.json());

    return updatedYearlyProgress;
  };

  const getDayOfYear = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff =
      date.getTime() -
      startOfYear.getTime() +
      (startOfYear.getTimezoneOffset() - date.getTimezoneOffset()) *
        60 *
        1000;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const handleDelete = async () => {
    // Implement delete functionality
    const deletedHabit = await fetch(`/api/habit`, {
      method: "DELETE",
      body: JSON.stringify({ id: habit.id }),
    }).then((res) => res.json());

    setHabits(habits.filter((h) => h.id !== habit.id));
  };

  const handleArchive = async () => {
    // Implement archive functionality
    const updatedHabit = await fetch(`/api/habit/archive`, {
      method: "PATCH",
      body: JSON.stringify({ id: habit.id }),
    }).then((res) => res.json());

    setHabits(
      habits.map((h) =>
        h.id === habit.id ? { ...h, isArchived: true } : h
      )
    );
  };

  const handleEdit = () => {
    setSelectedHabit(habit);
    setTimeout(() => {
      setIsEditHabitModalOpen(true);
    }, 100);
  };

  const isEmojiIcon = isEmoji(habit.icon || "default");
  let iconUsed = habit.icon ? habit.icon : "default";
  if (iconUsed === "default") {
    iconUsed = "shield-question";
  }
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center">
            {isEmojiIcon ? (
              <span className="text-2xl">{iconUsed}</span>
            ) : (
              <DynamicIcon
                className="w-4 h-4"
                name={iconUsed as any}
              />
            )}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              {habit.title}
            </CardTitle>
            <p className="text-sm">
              {completions[getDayOfYear(new Date()) - 1] || 0} /{" "}
              {habit.targetCount} {habit.metric}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleIncrement}>+1</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              className="w-fit bg-white p-0 border shadow-xl rounded-md"
            >
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 px-4 py-1"
                onClick={handleEdit}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 px-4 py-1"
                onClick={handleArchive}
              >
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 px-4 py-1"
                onClick={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {habit.targetCount > 10 && (
            <Button
              onClick={() => setCustomCompletionModalOpen(true)}
            >
              ...
            </Button>
          )}
        </div>
      </CardContent>

      <Modal
        title="Enter Custom Completion"
        isOpen={customCompletionModalOpen}
        onClose={() => setCustomCompletionModalOpen(false)}
      >
        <div className="p-4">
          <Input
            type="number"
            value={customCompletionInput}
            onChange={(e) => setCustomCompletionInput(e.target.value)}
            placeholder="Enter value"
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setCustomCompletionModalOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={handleCustomCompletion} className="ml-2">
              Set
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default HabitCard;
