import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(3),
  description: z.string().max(120),
  categoryId: z.string().nullable(),
  dueDate: z.coerce.date().nullish(),
  scheduledOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success)
      return new NextResponse("Invalid body", { status: 400 });

    const { scheduledOn, ...rest } = parsed.data;

    const task = await db.task.create({
      data: {
        ...rest,
        userId: profile.userID,
        scheduledOn: new Date(`${scheduledOn}T00:00:00Z`),
      },
      include: { category: true },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
