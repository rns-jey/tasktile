import { redirect } from "next/navigation";

import currentProfile from "@/lib/profile";
import { getTasks } from "@/lib/queries/task";

import TaskListSection from "@/components/organisms/TaskListSection";
import { Fragment } from "react";

export default async function TasksPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tasks = await getTasks(currentUser.userID);

  return (
    <Fragment>
      <header className="flex flex-col justify-between gap-4 pb-4">
        <h1 className="flex flex-col">
          <span className="font-display text-display-lg">Tasks</span>
        </h1>
      </header>

      <TaskListSection initialTasks={tasks} />
    </Fragment>
  );
}
