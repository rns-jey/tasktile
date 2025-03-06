import currentProfile from "@/lib/current-profile";
import TaskList from "./task-list";
import { db } from "@/lib/db";

export default async function TaskSection() {
  const profile = await currentProfile();

  if (!profile) return null;

  const [tasks, categories] = await Promise.all([
    db.task.findMany({ where: { userId: profile.id }, include: { category: true }, orderBy: [{ createdAt: "desc" }] }),
    db.category.findMany({ where: { userId: profile.id } }),
  ]);

  return <TaskList taskList={tasks} categoryList={categories} />;
}
