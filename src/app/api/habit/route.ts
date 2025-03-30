import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the import based on your project structure

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const {
    title,
    description,
    frequency,
    timeOfDay,
    type,
    targetCount,
    startDate,
    endDate,
    icon,
    overflow,
    daysOfWeek,
    metric,
    tags,
  } = await request.json();

  console.log({ startDate, timeOfDay });
  const newHabit = await db.habit.create({
    data: {
      title,
      description,
      icon,
      frequency,
      timeOfDay,
      type,
      overflow,
      daysOfWeek,
      metric,
      targetCount,
      startDate,
      endDate,
      yearlyProgress: {
        create: {
          year: new Date(startDate).getFullYear(),
          completions: new Array(365).fill("0").join(","),
        },
      },
      tags,
      user: {
        connect: { clerkId: userId }, // Replace with actual user ID logic
      },
    },
    include: {
      yearlyProgress: true,
    },
  });

  return NextResponse.json(newHabit);
}

export async function PATCH(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const { id, updates } = await request.json();
  const updatedHabit = await db.habit.update({
    where: { id },
    data: {
      title: updates.title,
      description: updates.description,
      icon: updates.icon,
      frequency: updates.frequency,
      timeOfDay: updates.timeOfDay,
      type: updates.type,
      overflow: updates.overflow,
      metric: updates.metric,
      daysOfWeek: updates.daysOfWeek,
      targetCount: updates.targetCount,
      startDate: updates.startDate,
      endDate: updates.endDate,
      tags: updates.tags,
    },
    include: {
      yearlyProgress: true,
    },
  });

  return NextResponse.json(updatedHabit);
}

export async function DELETE(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const { id } = await request.json();
  await db.habit.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Habit deleted successfully" });
}
