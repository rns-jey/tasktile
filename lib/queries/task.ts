import { db } from "../db";

export function getTodayTasks(userId: string, today: Date) {
  return db.task.findMany({
    where: {
      userId: userId,
      OR: [
        // everything due today (done or not)
        { dueOn: today },
        {
          completed: false,
          dueOn: {
            lt: today,
          },
        },
        { completedOn: today },
      ],
    },
    include: { stack: true, tags: true },
    orderBy: [{ createdAt: "asc" }],
  });
}

export function getTasks(userId: string) {
  return db.task.findMany({
    where: {
      userId: userId,
    },
    include: { stack: true, tags: true },
    orderBy: [{ createdAt: "desc" }],
  });
}

export function getInbox(userId: string) {
  return db.task.findMany({
    where: {
      userId: userId,
      stackId: null,
    },
    include: { stack: true, tags: true },
    orderBy: [{ createdAt: "desc" }],
  });
}

export function getStackTasks(userId: string, stackId: string) {
  return db.task.findMany({
    where: {
      userId: userId,
      stackId: stackId,
    },
    include: { stack: true, tags: true },
    orderBy: [{ createdAt: "desc" }],
  });
}

export function getTasksForDay(userId: string, dayKey: string) {
  const day = new Date(dayKey + "T00:00:00.000Z");

  return db.task.findMany({
    where: { userId, completed: true, completedOn: day },
    orderBy: { completedAt: "desc" },
    include: { stack: true, tags: true },
  });
}

export function getOnDue(userId: string, today: Date) {
  return db.task.findMany({
    where: {
      userId: userId,
      OR: [
        {
          dueOn: {
            gt: today,
          },
        },
      ],
    },
    include: { stack: true, tags: true },
    orderBy: [{ dueOn: "asc" }],
  });
}
