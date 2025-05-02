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

    const now = new Date();
    const today = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );

    const [contributions, totalCount, completedToday] = await Promise.all([
      db.task.groupBy({
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
      }),
      db.task.count({
        where: {
          userId: profile.id,
          completedAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      db.task.count({
        where: {
          userId: profile.id,
          completedAt: today,
        },
      }),
    ]);

    return NextResponse.json({
      contributions,
      totalCount,
      completedToday,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
