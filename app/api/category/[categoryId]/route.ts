import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type tParams = Promise<{ categoryId: string }>;

export async function DELETE(req: Request, props: { params: tParams }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { categoryId } = await props.params;

    if (!categoryId) return new NextResponse("Task ID is required", { status: 404 });

    const server = await db.category.delete({
      where: { id: categoryId, userId: profile.id },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CATEGORY_ID_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
