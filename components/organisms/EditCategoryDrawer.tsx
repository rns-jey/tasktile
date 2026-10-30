"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { flushPendingDeletes, useDeleteTask } from "@/hooks/useDeleteTask";
import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";
import { TaskWithCategory } from "@/types";

import { fromDbDay } from "@/lib/date";
import { cn } from "@/lib/utils";
import TaskMeta from "../molecules/TaskMeta";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import NewCategoryForm from "./NewCategoryForm";
import TaskForm from "./TaskForm";

type EditTaskDrawerProps = {
  task: TaskWithCategory;
  variant?: "full" | "compact";
};

export default function EditCategoryDrawer({
  task,
  variant,
}: EditTaskDrawerProps) {
  const compact = variant === "compact";

  const [open, setOpen] = useState(false);
  const [newCateg, setNewCateg] = useState(false);
  const pendingDelete = useRef(false);

  const { name, description, categoryId, dueDate } = task;

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    values: {
      name: name,
      description: description,
      categoryId: categoryId,
      dueDate: dueDate ? fromDbDay(dueDate) : null,
    },
  });

  const handleDelete = () => {
    pendingDelete.current = true;
  };

  const removeTask = useDeleteTask();

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (next) flushPendingDeletes();
        else {
          taskForm.reset();
          setNewCateg(false);
        }
        setOpen(next);
      }}
      onAnimationEnd={(isOpen) => {
        if (!isOpen && pendingDelete.current) {
          pendingDelete.current = false;
          removeTask(task);
        }
      }}
    >
      <DrawerTrigger asChild>
        <button type="button" className="flex w-full cursor-pointer text-left">
          <div
            className={cn(
              compact
                ? "w-full flex-row items-center justify-between"
                : "flex-col gap-0.5",
              "flex min-w-0",
            )}
          >
            <span
              className={cn(
                task.completed && "text-muted line-through",
                "text-task w-full truncate font-medium",
              )}
            >
              {task.name}
            </span>

            {compact ? (
              task.category && (
                <div
                  className="h-3 min-w-3 rounded-xs"
                  style={{ backgroundColor: task.category.color }}
                />
              )
            ) : (
              <TaskMeta task={task} />
            )}
          </div>
        </button>
      </DrawerTrigger>
      <DrawerContent className="pb-4" aria-describedby={undefined}>
        <div hidden={newCateg}>
          <TaskForm
            task={task}
            form={taskForm}
            formId="form-edit-task"
            setOpen={setOpen}
            setNewCateg={setNewCateg}
            onDelete={handleDelete}
          />
        </div>

        {newCateg && (
          <NewCategoryForm
            setNewCateg={setNewCateg}
            onCreated={(id) => taskForm.setValue("categoryId", id)}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
