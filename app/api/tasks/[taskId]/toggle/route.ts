import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tParams = Promise<{ taskId: string }>;

export async function PATCH(req: Request, props: { params: tParams }) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { taskId } = await props.params;

    if (!taskId)
      return new NextResponse("Task ID is required", { status: 404 });

    const { completed } = await req.json();

    const now = new Date();
    const today = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    );
    const completedAt = completed ? today : null;

    const newTask = await db.task.update({
      where: { id: taskId, userId: profile.id },
      data: {
        completed,
        completedAt,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
