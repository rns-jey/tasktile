import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

type tParams = Promise<{ taskId: string }>;

const bodySchema = z.object({
  completed: z.boolean(),
  localDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tz: z.string(),
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

    const { completed, localDay, tz } = parsed.data;

    const task = await db.task.update({
      where: { id: taskId, userId: profile.userID },
      data: completed
        ? {
            completed: true,
            completedAt: new Date(),
            completedOn: new Date(`${localDay}T00:00:00Z`),
            completedTz: tz,
          }
        : {
            completed: false,
            completedAt: null,
            completedOn: null,
            completedTz: "",
          },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
