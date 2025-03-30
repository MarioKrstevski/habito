"use client";
import { Habit, HabitYearlyProgress } from "@prisma/client";
import { useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import {
  HabitWithParsedYearlyProgress,
  HabitWithYearlyProgress,
} from "@/types/habits";
export function HabitsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setHabits, appDate, setTags } = useAppState();
  useEffect(() => {
    const fetchHabits = async () => {
      const habits = await fetch("/api/habits").then((res) =>
        res.json()
      );
      console.log(habits);
      // const habits = await getHabits(appDate?.getFullYear());

      let habitsParsed: HabitWithParsedYearlyProgress[] = habits.map(
        (habit: HabitWithYearlyProgress) => ({
          ...habit,
          yearlyProgress: habit.yearlyProgress.map(
            (progress: HabitYearlyProgress) => ({
              ...progress,
              completions: progress.completions.split(","),
            })
          ),
        })
      );
      const tags: string[] = Array.from(
        new Set(habits.map((habit: Habit) => habit.tags).flat())
      );

      setHabits(habitsParsed);
      setTags(tags);
    };
    fetchHabits();
  }, [appDate?.getFullYear()]);

  return <>{children}</>;
}
