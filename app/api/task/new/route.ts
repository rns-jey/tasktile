import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { name, description, categoryId, dueDate } = await req.json();

    const task = await db.task.create({
      data: {
        name,
        description,
        categoryId,
        dueDate,
        userId: profile.id,
      },
      include: { category: true },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
