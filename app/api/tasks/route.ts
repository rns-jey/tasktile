import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const tasks = await db.task.findMany({
      where: { userId: profile.id },
      include: { category: true },
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
