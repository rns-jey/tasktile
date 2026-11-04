import { db } from "../db";

export function getStats(userId: string) {
  return db.task.groupBy({
    by: ["completedOn"],
    where: {
      userId: userId,
      completed: true,
    },
    _count: {
      completed: true,
    },
    orderBy: [{ completedOn: "desc" }],
  });
}
