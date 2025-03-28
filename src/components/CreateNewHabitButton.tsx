"use client";
import { useAppState } from "@/hooks/useAppState";
import { Button } from "./ui/button";

interface CreateNewHabitButtonProps {
  label?: string;
  className?: string;
}
export default function CreateNewHabitButton({
  label = "+ Add Habits",
  className,
}: CreateNewHabitButtonProps) {
  const { setIsCreateHabitModalOpen } = useAppState();
  return (
    <Button
      variant="default"
      onClick={() => setIsCreateHabitModalOpen(true)}
      className={className}
    >
      {label}
    </Button>
  );
}
