import { Stack } from "@/lib/generated/prisma/client";

export type StackWithTaskCount = Stack & {
  _count: { tasks: number };
};
