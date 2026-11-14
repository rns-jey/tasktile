import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import currentProfile from "@/lib/profile";
import { z } from "zod";

const bodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give your stack a name")
    .max(40, "Keep it under 40 characters"),
});

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success)
      return new NextResponse("Invalid body", { status: 400 });

    const { name } = parsed.data;

    const task = await db.stack.create({
      data: {
        userId: profile.userID,
        name,
        nameKey: name.toLowerCase(),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return NextResponse.json(
        { error: "You already have a stack with that name" },
        { status: 409 },
      );

    console.error(error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
