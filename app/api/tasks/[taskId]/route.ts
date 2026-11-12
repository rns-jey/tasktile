import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import currentProfile from "@/lib/profile";
import { taskFormSchema } from "@/lib/schemas/task";
import { z } from "zod";

type tParams = Promise<{ taskId: string }>;

export async function DELETE(req: Request, props: { params: tParams }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { taskId } = await props.params;

    if (!taskId)
      return new NextResponse("Task ID is required", { status: 404 });

    const task = await db.task.delete({
      where: { id: taskId, userId: profile.userID },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("[TASK_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: tParams }) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { taskId } = await props.params;

    const parsed = taskFormSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(z.treeifyError(parsed.error), { status: 400 });

    const { dueOn, ...rest } = parsed.data;

    if (rest.categoryId) {
      const owns = await db.category.findFirst({
        where: { id: rest.categoryId, userId: profile.userID },
      });
      if (!owns) return new NextResponse("Invalid category", { status: 400 });
    }

    const task = await db.task.update({
      where: { id: taskId, userId: profile.userID },
      data: {
        ...rest,
        dueOn: dueOn ? new Date(`${dueOn}T00:00:00Z`) : null,
      },
      include: { category: true },
    });

    return NextResponse.json(task);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    )
      return new NextResponse("Task not found", { status: 404 });
    console.log("[TASK_ID_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
