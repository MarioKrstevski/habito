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
  const { hypID, completions } = await request.json();
  const updatedHabit = await db.habitYearlyProgress.update({
    where: { id: hypID },
    data: {
      completions: completions,
    },
  });

  return NextResponse.json(updatedHabit);
}
