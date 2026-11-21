import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import currentProfile from "@/lib/profile";

const bodySchema = z.object({
  name: z.string().trim().min(2, "Category name is required"),
});

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success)
      return new NextResponse("Invalid body", { status: 400 });

    const { name } = parsed.data;

    const newTag = await db.tag.create({
      data: {
        name,
        nameKey: name.toLowerCase(),
        userId: profile.userID,
      },
    });

    return NextResponse.json(newTag);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return new NextResponse("Tag name already exists", { status: 409 });
    }

    console.log(error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
