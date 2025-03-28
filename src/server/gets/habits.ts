"use server";

import { habits } from "@/data/habits";

export async function getHabits(year?: number) {
  if (!year) {
    year = new Date().getFullYear();
  }

  for (const habit of habits) {
    habit.habitYearlyProgress = habit.habitYearlyProgress.filter(
      (hyp) => hyp.year === year
    );
  }

  return habits;
}
