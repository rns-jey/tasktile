import { NextResponse } from "next/server";
import { z } from "zod";

import { categColors } from "@/lib/colors";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import currentProfile from "@/lib/profile";

const bodySchema = z.object({
  name: z.string().trim().min(2, "Category name is required"),
  color: z.enum(categColors),
});

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success)
      return new NextResponse("Invalid body", { status: 400 });

    const { name, color } = parsed.data;

    const newCategory = await db.category.create({
      data: {
        name,
        nameKey: name.toLowerCase(),
        color,
        userId: profile.userID,
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return new NextResponse("Category name already exists", { status: 409 });
    }

    console.log(error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
