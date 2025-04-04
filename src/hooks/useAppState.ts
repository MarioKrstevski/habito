import { getCachedDateIndex } from "@/lib/utils";
import { HabitWithParsedYearlyProgress } from "@/types/habits";
import { Habit, HabitYearlyProgress } from "@prisma/client";
import { create } from "zustand";

interface useAppStateStore {
  appDate: Date | null;
  isCreateHabitModalOpen: boolean;
  isEditHabitModalOpen: boolean;
  selectedHabit: Habit | null;
  dayIndex: number;
  tags: string[];
  habits: HabitWithParsedYearlyProgress[];
  setHabits: (habits: HabitWithParsedYearlyProgress[]) => void;
  setAppDate: (date: Date | null) => void;
  setDayIndex: (dayIndex: number) => void;
  setIsCreateHabitModalOpen: (isOpen: boolean) => void;
  setIsEditHabitModalOpen: (isOpen: boolean) => void;
  setSelectedHabit: (habit: Habit | null) => void;
  setTags: (tags: string[]) => void;
}

export const useAppState = create<useAppStateStore>((set) => ({
  appDate: new Date(),
  tags: [],
  isCreateHabitModalOpen: false,
  isEditHabitModalOpen: false,
  selectedHabit: null,
  dayIndex: getCachedDateIndex(
    new Date().getMonth(),
    new Date().getDate()
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
  setSelectedHabit: (habit: Habit | null) =>
    set({ selectedHabit: habit }),
  setIsCreateHabitModalOpen: (isOpen: boolean) =>
    set({ isCreateHabitModalOpen: isOpen }),
  setIsEditHabitModalOpen: (isOpen: boolean) =>
    set({ isEditHabitModalOpen: isOpen }),
  setTags: (tags: string[]) => set({ tags }),
}));

console.log(useAppState.getState().appDate);
