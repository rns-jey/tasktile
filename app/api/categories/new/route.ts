import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { name, color } = await req.json();

    const newCategory = await db.category.create({
      data: {
        name,
        color,
        userId: profile.id,
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return new NextResponse("Category name already exists", { status: 409 });
    }

    return new NextResponse("Internal Server Errorsss", { status: 500 });
  }
}
