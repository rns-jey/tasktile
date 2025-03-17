import { db } from "@/lib/db";
import TaskList from "./task-list";
import currentProfile from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

export default async function TaskSection() {
  const profile = await currentProfile();

  if (!profile) return (await auth()).redirectToSignIn();

  const [tasks, categories] = await Promise.all([
    db.task.findMany({
      where: { userId: profile.id },
      include: { category: true },
      orderBy: [{ createdAt: "desc" }],
    }),

    db.category.findMany({
      where: { userId: profile.id },
    }),
  ]);

  return <TaskList tasks={tasks} categories={categories} />;
}
