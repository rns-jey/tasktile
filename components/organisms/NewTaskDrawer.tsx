"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";

import { Button } from "../ui/Button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import NewCategoryForm from "./NewCategoryForm";
import TaskForm from "./TaskForm";

export default function NewTaskDrawer() {
  const [open, setOpen] = useState(false);
  const [newCateg, setNewCateg] = useState(false);

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: null,
      dueDate: null,
    },
  });

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setNewCateg(false);
      }}
    >
      <DrawerTrigger asChild>
        <Button className="h-16 w-16 rounded-2xl">
          <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <div hidden={newCateg}>
          <TaskForm
            form={taskForm}
            formId="form-add-task"
            setOpen={setOpen}
            setNewCateg={setNewCateg}
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
