import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  console.log(userId);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const habits = await db.habit.findMany({
      where: { user: { clerkId: userId } },
      include: { yearlyProgress: true },
    });
    return NextResponse.json(habits);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}
