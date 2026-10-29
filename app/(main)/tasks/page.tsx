import TaskList from "@/components/organisms/TaskList";
import { Field } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import currentProfile from "@/lib/current-profile";
import { getTasks } from "@/lib/queries/task";
import { SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tasks = await getTasks(currentUser.userID);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

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

        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">
              <span>Open</span>
              <span>{activeTasks.length}</span>
            </TabsTrigger>
            <TabsTrigger value="closed">
              <span>Closed</span>
              <span>{completedTasks.length}</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="open">
            <TaskList tasks={activeTasks} />
          </TabsContent>
          <TabsContent value="closed">
            <TaskList tasks={completedTasks} />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </main>
  );
}
