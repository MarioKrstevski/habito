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
  } = await request.json();

  console.log({ startDate, timeOfDay });
  const newHabit = await db.habit.create({
    data: {
      title,
      description,
      frequency,
      timeOfDay,
      type,
      targetCount,
      startDate,
      endDate,
      yearlyProgress: {
        create: {
          year: new Date(startDate).getFullYear(),
          completions: new Array(365).fill("0").join(","),
        },
      },
      user: {
        connect: { clerkId: userId }, // Replace with actual user ID logic
      },
    },
  });

  return NextResponse.json(newHabit);
}

export async function PUT(request: NextRequest) {
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
    data: updates,
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
