import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tParams = Promise<{ taskId: string }>;

export async function DELETE(req: Request, props: { params: tParams }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { taskId } = await props.params;

    if (!taskId) return new NextResponse("Task ID is required", { status: 404 });

    const task = await db.task.delete({
      where: { id: taskId, userId: profile.id },
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

    if (!taskId) return new NextResponse("Task ID is required", { status: 404 });

    const { name, description, categoryId, dueDate } = await req.json();

    const newTask = await db.task.update({
      where: { id: taskId, userId: profile.id },
      data: {
        name,
        description,
        categoryId,
        dueDate,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
