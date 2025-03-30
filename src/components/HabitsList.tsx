"use client";
// components/MainContent.tsx
import { useAppState } from "@/hooks/useAppState";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "./ui/button";
import HabitCard from "./HabitCard";
export function HabitsList() {
  const { habits, dayIndex, setHabits, appDate } = useAppState();

  console.log(appDate);
  const [filter, setFilter] = useQueryState<string>(
    "filter",
    parseAsString.withDefault("all")
  );
  const [tag, setTag] = useQueryState<string>(
    "tag",
    parseAsString.withDefault("all")
  );
  // console.log(habits, typeof habits, Array.isArray(habits));
  const filteredHabits = habits
    // .filter(
    //   (habit) =>
    //     habit.yearlyProgress && habit.yearlyProgress.length > 0
    // )
    .filter((habit) => {
      const habitStartDate = new Date(habit.startDate);
      // console.log(habitStartDate);
      // console.log(appDate);
      return appDate && habitStartDate <= appDate;
    })
    .filter((habit) => {
      const yearlyProgress = habit.yearlyProgress.find(
        (progress) => progress.year === appDate?.getFullYear()
      );
      return yearlyProgress && yearlyProgress.completions.length > 0;
    })
    .filter((habit) => {
      const yearlyProgress = habit.yearlyProgress.find(
        (progress) => progress.year === appDate?.getFullYear()
      );
      if (!yearlyProgress) return false;
      if (tag === "all") return true;
      return habit.tags.includes(tag);
    })
    .filter((habit) => {
      const yearlyProgress = habit.yearlyProgress.find(
        (progress) => progress.year === appDate?.getFullYear()
      );
      if (!yearlyProgress) return false;

      const completions = yearlyProgress.completions;
      // if (filter === "archived") {
      //   return habit.isArchived;
      // }
      // if (filter === "all") return true;

      if (filter === "completed") {
        return completions[dayIndex] === "1";
      }

      if (filter === "unfinished") {
        return completions[dayIndex] === "0";
      }
      return true;
    })
    .filter((habit) => {
      if (filter === "archived") {
        return habit.isArchived;
      }
      return !habit.isArchived;
    });
  if (filteredHabits.length === 0) {
    if (filter === "completed") {
      return (
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">
            No habits found that are completed today
          </h1>
        </div>
      );
    }

    if (filter === "unfinished") {
      return (
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-4">
            Every habit is completed today
          </h1>
        </div>
      );
    }
  }

  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">
        Filter: {filter} {typeof filter}
      </h1>
      <h1 className="text-2xl font-bold mb-4">My own</h1>
      <div className="space-y-4">
        {filteredHabits.map((habit, index) => {
          return <HabitCard key={habit.id} habit={habit} />;
        })}
        {/* //   const yearlyProgress = habit.yearlyProgress.find(
        //     (progress) => progress.year === appDate?.getFullYear()
        //   );
        //   if (!yearlyProgress) return null; // Skip if no yearly progress found
        //   const completions = yearlyProgress.completions;

        //   return (
        //     <div key={index} className="p-4 rounded border">
        //       <h2 className="text-xl">{habit.title}</h2>
        //       <p>{habit.description}</p>
        //       <p>
        //         {completions[dayIndex]} / {habit.targetCount}{" "}
        //         {habit.metric}
        //       </p>
        //       <Button
        //         disabled={
        //           Number(completions[dayIndex]) >= habit.targetCount
        //         }
        //         variant="outline"
        //         onClick={() => {
        //           const prevValue = completions[dayIndex];
        //           const newValue = Number(prevValue) + 1;
        //           if (newValue > habit.targetCount) return;
        //           const updatedHabit = (yearlyProgress.completions[
        //             dayIndex
        //           ] = newValue.toString());
        //           console.log(updatedHabit);
        //           setHabits(habits);
        //         }}
        //       >
        //         +1
        //       </Button>
        //     </div>
        //   );
        // })} */}
      </div>
    </div>
  );
}
