import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import currentProfile from "@/lib/profile";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const tasks = await db.task.findMany({
      where: { userId: profile.userID },
      include: { category: true },
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
