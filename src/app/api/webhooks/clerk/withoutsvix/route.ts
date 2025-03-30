// /app/api/webhooks/clerk/route.ts
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";
export async function GET(req: Request) {
  return NextResponse.json({ message: "Hello, world!" });
}
export async function POST(req: Request) {
  const payload = await req.json();
  console.log({ payload });
  return NextResponse.json({ message: "Hello, world!" });
}
