"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";

import { cn } from "@/lib/utils";
import { Button } from "../atoms/Button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import CategoriesDrawer from "./CategoriesDrawer";
import NewTaskForm from "./NewTaskForm";

export default function NewTaskDrawer() {
  const [open, setOpen] = useState(false);
  const [newCateg, setNewCateg] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState(false);

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: null,
      dueDate: null,
    },
  });

  const selectedCategoryId = taskForm.watch("categoryId");

  const scrollToOpenEnd = () =>
    requestAnimationFrame(() =>
      document
        .getElementById("open-end")
        ?.scrollIntoView({ behavior: "smooth", block: "end" }),
    );

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSelectingCategory(false);
      }}
    >
      <DrawerTrigger
        render={
          <Button
            type="button"
            className={cn(
              "border-foreground absolute right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 m-4 size-14 rounded-xl border shadow-[3px_3px_0_var(--ink)] md:bottom-4",
              open && "hidden",
            )}
            onClick={scrollToOpenEnd}
          >
            <Plus className="size-7" />
          </Button>
        }
      />
      <DrawerContent className="pb-4">
        <div hidden={newCateg || selectingCategory}>
          {/* <TaskForm
            form={taskForm}
            formId="form-add-task"
            setOpen={setOpen}
            setNewCateg={setNewCateg}
            setSelectingCategory={setSelectingCategory}
          /> */}
          <NewTaskForm />
        </div>

        {selectingCategory && (
          <CategoriesDrawer
            onSelect={(id) => taskForm.setValue("categoryId", id)}
            selectedCategoryId={selectedCategoryId}
            setSelectingCategory={setSelectingCategory}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
