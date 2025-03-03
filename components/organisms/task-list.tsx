"use client";

import { useState } from "react";
import { Task } from "@prisma/client";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { Plus, Trash2, Undo2 } from "lucide-react";

import { AnimatePresence, motion } from "motion/react";
import { Checkbox } from "../atoms/checkbox";
import NewTaskForm from "./new-task-form";

interface TaskListProps {
  data: Task[];
}

export default function TaskList({ data }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(data);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>

      {/* Add new task */}
      <NewTaskForm tasks={tasks} setTasks={setTasks} />

      {/* Active tasks */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-primary">Active Tasks</h2>
        <div className="space-y-1">
          <AnimatePresence>
            {activeTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-card rounded-md border"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                    className="cursor-pointer"
                  />
                  <label htmlFor={`task-${task.id}`} className="text-sm font-medium cursor-pointer">
                    {task.name}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {activeTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-3">
              No active tasks. Add a new task to get started!
            </p>
          )}
        </div>
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
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskStatus(task.id)}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className="text-sm font-medium line-through text-muted-foreground cursor-pointer"
                  >
                    {task.name}
                  </label>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTaskStatus(task.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
