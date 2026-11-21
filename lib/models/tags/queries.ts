import { db } from "@/lib/db";

export function getTags(userId: string) {
  return db.tag.findMany({
    where: {
      userId: userId,
    },
    orderBy: [{ createdAt: "desc" }],
  });
}
