import { db } from "../db";

export function getCategories(userId: string) {
  return db.category.findMany({
    where: {
      userId: userId,
    },
  });
}

export function getCategoriesCount(userId: string) {
  return db.category.count({
    where: {
      userId: userId,
    },
  });
}

export async function getCategoryWithCounts(userId: string) {
  const categories = await db.category.findMany({
    where: {
      userId: userId,
    },
    include: { tasks: { select: { completed: true } } },
  });

  return categories
    .map(({ tasks, ...category }) => ({
      ...category,
      openCount: tasks.filter((t) => !t.completed).length,
      closedCount: tasks.filter((t) => t.completed).length,
    }))
    .sort(
      (a, b) =>
        b.openCount - a.openCount || // most open tasks first
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }), // then A–Z
    );
}
