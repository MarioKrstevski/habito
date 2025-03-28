import { getCachedDateIndex } from "@/lib/utils";
import { HabitWithParsedYearlyProgress } from "@/types/habits";
import { Habit, HabitYearlyProgress } from "@prisma/client";
import { create } from "zustand";

interface useAppStateStore {
  appDate: Date | null;
  isCreateHabitModalOpen: boolean;
  dayIndex: number;
  habits: HabitWithParsedYearlyProgress[];
  setHabits: (habits: HabitWithParsedYearlyProgress[]) => void;
  setAppDate: (date: Date | null) => void;
  setDayIndex: (dayIndex: number) => void;
  setIsCreateHabitModalOpen: (isOpen: boolean) => void;
}

export const useAppState = create<useAppStateStore>((set) => ({
  appDate: new Date(),
  isCreateHabitModalOpen: false,
  dayIndex: getCachedDateIndex(
    new Date().getMonth(),
    new Date().getDay()
  ),
  habits: [],
  setAppDate: (date: Date | null) =>
    set({
      appDate: date,
      dayIndex: getCachedDateIndex(date?.getMonth(), date?.getDay()),
    }),
  setDayIndex: (dayIndex: number) => set({ dayIndex }),
  setHabits: (habits: HabitWithParsedYearlyProgress[]) =>
    set({ habits }),
  setIsCreateHabitModalOpen: (isOpen: boolean) =>
    set({ isCreateHabitModalOpen: isOpen }),
}));
