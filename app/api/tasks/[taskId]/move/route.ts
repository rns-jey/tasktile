import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import currentProfile from "@/lib/profile";

type tParams = Promise<{ taskId: string }>;

const bodySchema = z.object({
  stackId: z.string(),
});

export async function PATCH(req: Request, props: { params: tParams }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { taskId } = await props.params;
    if (!taskId)
      return new NextResponse("Task ID is required", { status: 400 });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success)
      return new NextResponse("Invalid body", { status: 400 });

    const { stackId } = parsed.data;

    const task = await db.task.update({
      where: { id: taskId, userId: profile.userID },
      data: {
        stackId: stackId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
