"use client";

import { TaskWithCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { flushPendingDeletes, useDeleteTask } from "@/hooks/useDeleteTask";

import TaskMeta from "../molecules/TaskMeta";

import { taskFormSchema } from "@/lib/schemas/task";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import EditTaskForm from "./EditTaskForm";

export default function EditTaskDrawer({ task }: { task: TaskWithCategory }) {
  const [open, setOpen] = useState(false);
  const [newCateg, setNewCateg] = useState(false);
  const pendingDelete = useRef(false);

  const { name, description, categoryId, dueDate } = task;

  const taskForm = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    values: {
      name: name,
      description: description,
      categoryId: categoryId,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  const handleDelete = () => {
    pendingDelete.current = true;
    setOpen(false);
  };

  const removeTask = useDeleteTask();

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (next) flushPendingDeletes();
        else taskForm.reset();
        setOpen(next);
      }}
      onAnimationEnd={(isOpen) => {
        console.log("animationEnd", isOpen, pendingDelete.current, task.name);
        if (!isOpen && pendingDelete.current) {
          pendingDelete.current = false;
          removeTask(task);
        }
      }}
    >
      <DrawerTrigger asChild>
        <div className="flex w-full cursor-pointer">
          <div className="flex min-w-0 grow-0 flex-col gap-0.5">
            <span className="text-task w-full truncate font-medium">
              {task.name}
            </span>

            <TaskMeta task={task} />
          </div>

          <div className="flex-1" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="pb-4" aria-describedby={undefined}>
        <div hidden={newCateg}>
          <EditTaskForm
            task={task}
            form={taskForm}
            setOpen={setOpen}
            setNewCateg={setNewCateg}
            onDelete={handleDelete}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
