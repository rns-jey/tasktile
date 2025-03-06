"use client";

import { useState } from "react";
import { Category, Task } from "@prisma/client";

import { AnimatePresence, motion } from "motion/react";
import NewTaskForm from "./new-task-form";
import { ScrollArea } from "../atoms/scroll-area";
import TaskCard from "../molecules/task-card";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../atoms/accordion";
import { TaskWithCategory } from "@/types";
import SlideAnimation from "../atoms/slide-animation";

interface TaskListProps {
  taskList: TaskWithCategory[];
  categoryList: Category[];
}

export default function TaskList({ taskList, categoryList }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskWithCategory[]>(taskList);
  const [categories, setCategories] = useState<Category[]>(categoryList);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>

      {/* Add new task */}
      <NewTaskForm tasks={tasks} setTasks={setTasks} categories={categories} setCategories={setCategories} />

      {/* Active tasks */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-primary">Active Tasks</h2>
        {activeTasks.length > 0 && (
          <ScrollArea className={cn(activeTasks.length >= 5 ? "h-[300px]" : "h-fit")}>
            <AnimatePresence>
              <div className="space-y-1">
                {activeTasks.map((task) => (
                  <SlideAnimation key={task.id}>
                    <TaskCard
                      task={task}
                      tasks={tasks}
                      setTasks={setTasks}
                      categories={categories}
                      setCategories={setCategories}
                    />
                  </SlideAnimation>
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
      <Accordion type="single" collapsible>
        <AccordionItem value="completed-tasks">
          <AccordionTrigger>
            <h2 className="text-lg font-semibold text-primary">Completed Tasks</h2>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className={cn(completedTasks.length >= 5 ? "h-[300px]" : "h-fit")}>
              <AnimatePresence>
                <div className="space-y-1">
                  {completedTasks.map((task) => (
                    <SlideAnimation key={task.id}>
                      <TaskCard
                        task={task}
                        tasks={tasks}
                        setTasks={setTasks}
                        categories={categories}
                        setCategories={setCategories}
                      />
                    </SlideAnimation>
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>
            {completedTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-3">No completed tasks yet.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
