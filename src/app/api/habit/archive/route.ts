import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const { id } = await request.json();
  const updatedHabit = await db.habit.update({
    where: { id },
    data: {
      isArchived: true,
    },
  });
  return NextResponse.json(updatedHabit);
}
