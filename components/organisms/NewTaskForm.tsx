"use client";

import { TaskWithCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, SquareIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/Drawer";
import { Field, FieldError, FieldGroup } from "../ui/Field";
import { Input } from "../ui/Input";

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
});

export default function NewTaskForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const queryClient = useQueryClient();

  const addTask = useMutation<
    TaskWithCategory,
    Error,
    {
      name: string;
    }
  >({
    mutationFn: async (newTask) => {
      const response = await axios.post("api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      form.reset();
      setOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTask.mutate(values);
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="h-16 w-16 rounded-2xl">
          <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerClose disabled={addTask.isPending}>Cancel</DrawerClose>
          <DrawerTitle>Add Task</DrawerTitle>
          <Button
            type="submit"
            form="form-add-task"
            disabled={addTask.isPending}
          >
            Add
          </Button>
        </DrawerHeader>

        <div className="flex items-center gap-2 p-4">
          <SquareIcon />
          <form
            id="form-add-task"
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log("Validation errors:", errors),
            )}
            className="w-full"
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                disabled={addTask.isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      id="form-add-task-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Add a task name .."
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
