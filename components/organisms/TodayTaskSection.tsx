"use client";

import { useTodayTasks } from "@/hooks/useTasks";
import { useState } from "react";
import TaskList from "./TaskList";

export default function TodayTaskSection() {
  const [visible, setVisible] = useState<boolean>(false);

  const { data: tasks = [] } = useTodayTasks();

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const orderedTasks = [...activeTasks, ...completedTasks];

  return (
    <div className="flex flex-col">
      <TaskList tasks={orderedTasks} />

      {/* {completedTasks.length !== 0 && (
        <>
          <Card className="mx-2 my-4">
            <CardContent className="flex items-center justify-between">
              <span className="font-medium tracking-[.08em] uppercase">
                DONE TODAY · {completedTasks.length}
              </span>

              <Button
                variant={"ghost"}
                type="button"
                onClick={() => setVisible(!visible)}
                className="text-accent-foreground font-semibold"
              >
                {visible ? "Hide" : "Show"}
              </Button>
            </CardContent>
          </Card>

          <div hidden={!visible}>
            <TaskList tasks={completedTasks} variant="compact" />
          </div>
        </>
      )} */}
    </div>
  );
}
