import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import currentProfile from "@/lib/profile";
import { taskFormSchema } from "@/lib/schemas/task";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = taskFormSchema.safeParse(await req.json());
    if (!parsed.success)
      return new NextResponse("Invalid body", { status: 400 });

    const { dueOn, ...rest } = parsed.data;

    const task = await db.task.create({
      data: {
        ...rest,
        userId: profile.userID,
        dueOn: dueOn ? new Date(`${dueOn}T00:00:00Z`) : null,
      },
      include: { category: true },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
