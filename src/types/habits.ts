import { Habit, HabitYearlyProgress } from "@prisma/client";

export type HabitWithYearlyProgress = Habit & {
  yearlyProgress: HabitYearlyProgress[];
};

// export type ParsedHabitYearlyProgress = HabitYearlyProgress & {
//   completions: string[];
// };

export type HabitWithParsedYearlyProgress = Habit & {
  yearlyProgress: ParsedHabitYearlyProgress[];
};

export interface ParsedHabitYearlyProgress
  extends Omit<HabitYearlyProgress, "completions"> {
  completions: string[]; // Change completions to string[] instead of string
}
