import { NextResponse } from "next/server";
import { z } from "zod";

import currentProfile from "@/lib/profile";
import { getStats } from "@/lib/queries/stats";

const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const stats = await getStats(profile.userID);

    return NextResponse.json(stats);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
