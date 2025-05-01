import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const contributions = await db.task.groupBy({
      by: ["completedAt"],
      where: {
        userId: profile.id,
        completedAt: {
          gte: start,
          lte: end,
        },
      },
      _count: {
        completed: true,
      },
    });

    return NextResponse.json(contributions);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
