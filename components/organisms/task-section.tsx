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

  return <TaskList data={tasks} />;
}
