import { db } from "../db";

export function getTodayTasks(userId: string, today: Date) {
  return db.task.findMany({
    where: {
      userId: userId,
      OR: [
        // everything scheduled today (done or not)
        { scheduledOn: today },
        // unfinished leftovers whose deadline is still ahead
        {
          completed: false,
          scheduledOn: { lt: today },
        },
        { completedOn: today },
      ],
    },
    include: { category: true },
    orderBy: [{ createdAt: "desc" }],
  });
}
