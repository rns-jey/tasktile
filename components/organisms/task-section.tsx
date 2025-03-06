import currentProfile from "@/lib/current-profile";
import TaskList from "./task-list";
import { db } from "@/lib/db";

export default async function TaskSection() {
  const profile = await currentProfile();

  if (!profile) return null;

  const tasks = await db.task.findMany({
    where: { userId: profile.id },
    orderBy: [{ createdAt: "desc" }],
  });

  const categories = await db.category.findMany({
    where: { userId: profile.id },
  });

  return <TaskList taskList={tasks} categories={categories} />;
}
