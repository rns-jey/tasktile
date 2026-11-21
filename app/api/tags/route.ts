import { NextResponse } from "next/server";

import { getTags } from "@/lib/models/tags/queries";
import currentProfile from "@/lib/profile";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const tasks = await getTags(profile.userID);

    return NextResponse.json(tasks);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
