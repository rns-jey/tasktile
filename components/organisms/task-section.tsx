import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/card";
import NewTaskForm from "./new-task-form";
import currentProfile from "@/lib/current-profile";
import TaskList from "./task-list";

export default async function TaskSection() {
  const profile = await currentProfile();

  if (!profile) return null;

  const tasks = await db.task.findMany({
    where: { userId: profile.id },
    orderBy: { dueDate: "asc" },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <NewTaskForm />
      </CardContent>
      <TaskList tasks={tasks} />
    </Card>
  );
}
