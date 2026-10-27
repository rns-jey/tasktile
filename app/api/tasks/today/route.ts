import currentProfile from "@/lib/current-profile";
import { dayInTz } from "@/lib/date";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const tz = (await cookies()).get("tz")?.value ?? "UTC";
    const day = dayInTz(tz);
    const today = new Date(`${day}T00:00:00Z`);

    const tasks = await db.task.findMany({
      where: {
        userId: profile.userID,
        OR: [
          // everything scheduled today (done or not)
          { scheduledOn: today },
          // unfinished leftovers whose deadline is still ahead
          {
            completed: false,
            scheduledOn: { lt: today },
          },
          { completedOn: today },
        ],
      },
      include: { category: true },
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
