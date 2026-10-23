"use client";

import { TaskWithCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SquareIcon } from "lucide-react";
import { Fragment, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useCategories } from "@/hooks/useCategories";
import { flushPendingDeletes, useDeleteTask } from "@/hooks/useDeleteTask";

import DatePicker from "../molecules/DatePicker";
import TaskMeta from "../molecules/TaskMeta";

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
import { Separator } from "../ui/Separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string().max(120),
  categoryId: z.string().nullable(),
  dueDate: z.date().nullable(),
});

export default function EditTaskForm({ task }: { task: TaskWithCategory }) {
  const [open, setOpen] = useState(false);

  const { name, description, categoryId, dueDate } = task;
  const { data: categories } = useCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      description: description,
      categoryId: categoryId,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  const pendingDelete = useRef(false);
  const removeTask = useDeleteTask();

  const queryClient = useQueryClient();

  const updateTask = useMutation<
    TaskWithCategory,
    Error,
    {
      name: string;
      description: string;
      categoryId?: string | null;
      dueDate?: Date | null;
    }
  >({
    mutationFn: async (updatedTask) => {
      const response = await axios.patch(`/api/tasks/${task.id}`, updatedTask);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      setOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateTask.mutate(values);
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (next) flushPendingDeletes();
        else form.reset();
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
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerClose
            disabled={updateTask.isPending}
            className="text-muted h-11 px-2 font-medium"
          >
            Cancel
          </DrawerClose>
          <DrawerTitle>Edit Task</DrawerTitle>
          <Button
            type="submit"
            form="form-edit-task"
            disabled={updateTask.isPending}
            className="bg-ink text-paper h-11 px-4 font-semibold"
          >
            Save
          </Button>
        </DrawerHeader>

        <div className="flex flex-col items-center gap-2 px-4">
          <form
            id="form-edit-task"
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log("Validation errors:", errors),
            )}
            className="w-full"
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                disabled={updateTask.isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-2">
                      <InputGroup>
                        <InputGroupAddon>
                          <SquareIcon />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id="form-edit-task-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="Add a task name .."
                        />
                      </InputGroup>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                disabled={updateTask.isPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id="form-edit-task-description"
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

              <Controller
                name="dueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={updateTask.isPending}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="text-label text-muted-2 mx-1 mt-3 mb-1.5 font-medium tracking-[.08em] uppercase">
                      Category · optional
                    </div>

                    <ToggleGroup
                      variant={"outline"}
                      value={field.value ? [field.value] : []}
                      onValueChange={(v) => field.onChange(v[0] ?? null)}
                      className="flex-wrap"
                      disabled={updateTask.isPending}
                    >
                      {categories && (
                        <Fragment>
                          {categories.map((category) => (
                            <ToggleGroupItem
                              key={category.id}
                              value={category.id}
                              className="flex items-center gap-2"
                            >
                              <span
                                className="h-2 w-2 rounded-xs"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </ToggleGroupItem>
                          ))}
                        </Fragment>
                      )}

                      <Button
                        variant={"outline"}
                        type="button"
                        disabled={updateTask.isPending}
                        className={"h-11 bg-transparent"}
                      >
                        + New
                      </Button>
                    </ToggleGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>

          <Separator className="my-2" />

          <DrawerClose asChild>
            <Button
              className="h-11 w-full cursor-pointer"
              variant={"destructive"}
              type="button"
              onClick={() => {
                pendingDelete.current = true;
              }}
              disabled={updateTask.isPending}
            >
              Delete task
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
