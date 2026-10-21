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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/InputGroup";

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string().max(120),
});

export default function NewTaskForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const queryClient = useQueryClient();

  const addTask = useMutation<
    TaskWithCategory,
    Error,
    {
      name: string;
      description: string;
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
      <DrawerContent className="pb-4">
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

        <div className="flex items-center gap-2 px-4">
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
                    <div className="flex items-center gap-2">
                      <InputGroup>
                        <InputGroupAddon>
                          <SquareIcon />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id="form-add-task-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="Add a task name .."
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                disabled={addTask.isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-add-task-description"
                        aria-invalid={fieldState.invalid}
                        placeholder="Add a description (optional)"
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="ml-auto">
                          0/120
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="text-label text-muted-2 mx-1 mt-3 mb-1.5 font-medium tracking-[.08em] uppercase">
              Category · optional
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
