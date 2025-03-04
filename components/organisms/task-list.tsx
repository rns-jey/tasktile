"use client";

import { useState } from "react";
import { Task } from "@prisma/client";

import { AnimatePresence, motion } from "motion/react";
import NewTaskForm from "./new-task-form";
import { ScrollArea } from "../atoms/scroll-area";
import TaskCard from "../molecules/task-card";

interface TaskListProps {
  data: Task[];
}

export default function TaskList({ data }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(data);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>

      {/* Add new task */}
      <NewTaskForm tasks={tasks} setTasks={setTasks} />

      {/* Active tasks */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-primary">Active Tasks</h2>
        {activeTasks.length > 0 && (
          <ScrollArea className="h-[280px] w-full">
            <AnimatePresence>
              <div className="space-y-1">
                {activeTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-3 bg-card rounded-md border"
                  >
                    <TaskCard task={task} tasks={tasks} setTasks={setTasks} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </ScrollArea>
        )}
        {activeTasks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-3">
            No active tasks. Add a new task to get started!
          </p>
        )}
      </div>

      {/* Completed tasks */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-primary">Completed Tasks</h2>
        <div className="space-y-1">
          <AnimatePresence>
            {completedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-muted rounded-md border"
              >
                <TaskCard task={task} tasks={tasks} setTasks={setTasks} />
              </motion.div>
            ))}
          </AnimatePresence>
          {completedTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-3">No completed tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
