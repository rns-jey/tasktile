import { NextResponse } from "next/server";

import { categColors } from "@/lib/colors";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import currentProfile from "@/lib/profile";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  color: z.enum(categColors),
});

type tParams = Promise<{ categoryId: string }>;

export async function DELETE(req: Request, props: { params: tParams }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { categoryId } = await props.params;

    const category = await db.category.delete({
      where: { id: categoryId, userId: profile.userID },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        return new NextResponse("Category not found", { status: 404 });
    }

    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: tParams }) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { categoryId } = await props.params;

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success)
      return new NextResponse("Invalid body", { status: 400 });

    const { name, color } = parsed.data;

    const updatedCategory = await db.category.update({
      where: { id: categoryId, userId: profile.userID },
      data: {
        name,
        nameKey: name.toLowerCase(),
        color,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        return new NextResponse("Category not found", { status: 404 });
      if (error.code === "P2002")
        return new NextResponse("Category name already exists", {
          status: 409,
        });
    }

    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
