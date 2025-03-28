// /app/api/webhooks/clerk/route.ts
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";

const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;
export async function POST(req: Request) {
  const payload = await req.text(); // Important: read as raw text, not JSON
  const headers = Object.fromEntries(req.headers.entries());
  console.log({ payload, headers });
  try {
    if (!clerkWebhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not defined");
    }

    const wh = new Webhook(clerkWebhookSecret);
    // Verify the webhook signature
    const event: any = wh.verify(payload, headers);
    console.log({ event });

    if (event.type === "user.created") {
      const { id, email_addresses, first_name, last_name } =
        event.data;

      console.log({ id, email_addresses, first_name, last_name });
      // Create user in the database
      await db.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        },
      });

      console.log("✅ User created successfully in DB!");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }
}
