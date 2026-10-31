import { redirect } from "next/navigation";

import currentProfile from "@/lib/profile";
import { getTasks } from "@/lib/queries/task";

import TaskListSection from "@/components/organisms/TaskListSection";

export default async function TasksPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tasks = await getTasks(currentUser.userID);

  return <TaskListSection initialTasks={tasks} />;
}
