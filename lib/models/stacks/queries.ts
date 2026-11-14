import { db } from "@/lib/db";

export function getStacks(userId: string) {
  return db.stack.findMany({
    where: {
      userId: userId,
    },
    include: {
      tasks: {
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: [{ createdAt: "asc" }],
  });
}

export function getStacksWithTaskCount(userId: string) {
  return db.stack.findMany({
    where: {
      userId: userId,
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: [{ createdAt: "asc" }],
  });
}
