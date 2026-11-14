import { NextResponse } from "next/server";

import { getStacksWithTaskCount } from "@/lib/models/stacks/queries";
import currentProfile from "@/lib/profile";

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const stacks = await getStacksWithTaskCount(profile.userID);

    return NextResponse.json(stacks);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
