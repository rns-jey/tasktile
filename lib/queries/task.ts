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

export function getTasks(userId: string) {
  return db.task.findMany({
    where: {
      userId: userId,
    },
    include: { category: true },
    orderBy: [{ createdAt: "desc" }],
  });
}

export function getTaskCount(userId: string) {
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

export function getTasksForDay(userId: string, dayKey: string) {
  const day = new Date(dayKey + "T00:00:00.000Z");

  return db.task.findMany({
    where: { userId, completed: true, completedOn: day },
    orderBy: { completedAt: "desc" },
    include: { category: true },
  });
}
