import currentProfile from "@/lib/profile";
import { getStackTasks } from "@/lib/queries/task";
import { NextResponse } from "next/server";

type params = Promise<{ stackId: string }>;

export async function GET(req: Request, { params }: { params: params }) {
  try {
    const [profile, { stackId }] = await Promise.all([
      currentProfile(),
      params,
    ]);

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tasks = await getStackTasks(profile.userID, stackId);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
