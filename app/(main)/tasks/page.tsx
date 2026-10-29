import { SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";

import currentProfile from "@/lib/profile";
import { getTasks } from "@/lib/queries/task";

import TaskListSection from "@/components/organisms/TaskListSection";
import { Field } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import { ScrollArea } from "@/components/ui/ScrollArea";

export default async function TasksPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tasks = await getTasks(currentUser.userID);

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 p-4">
        <header className="flex flex-col justify-between gap-4 pb-4">
          <h1 className="flex flex-col">
            <span className="font-display text-display-lg">Tasks</span>
          </h1>

          <Field>
            <InputGroup>
              <InputGroupInput
                id="inline-start-input"
                placeholder="Search..."
                className="h-11 text-base"
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </header>

        <TaskListSection initialTasks={tasks} />
      </ScrollArea>
    </main>
  );
}
