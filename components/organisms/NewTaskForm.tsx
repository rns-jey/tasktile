"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SquareIcon } from "lucide-react";
import { Fragment } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useCategories } from "@/hooks/useCategories";
import { localDay } from "@/lib/date";
import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";
import { TaskWithCategory } from "@/types";

import DatePicker from "../molecules/DatePicker";
import { Button } from "../ui/Button";
import { DrawerClose, DrawerHeader, DrawerTitle } from "../ui/Drawer";
import { Field, FieldError, FieldGroup } from "../ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/InputGroup";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";

interface NewTaskFormProps {
  form: UseFormReturn<TaskFormValues>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewCateg: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewTaskForm({
  form,
  setOpen,
  setNewCateg,
}: NewTaskFormProps) {
  const { data: categories } = useCategories();

  const queryClient = useQueryClient();

  const addTask = useMutation<
    TaskWithCategory,
    Error,
    z.infer<typeof taskFormSchema> & { scheduledOn: string }
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

  function onSubmit(values: z.infer<typeof taskFormSchema>) {
    addTask.mutate({ ...values, scheduledOn: localDay() });
  }

  return (
    <Fragment>
      <DrawerHeader className="flex flex-row items-center justify-between">
        <DrawerClose
          disabled={addTask.isPending}
          className="text-muted h-11 px-2 font-medium"
        >
          Cancel
        </DrawerClose>
        <DrawerTitle>Add Task</DrawerTitle>
        <Button
          type="submit"
          form="form-add-task"
          disabled={addTask.isPending}
          className="bg-ink text-paper h-11 px-4 font-semibold"
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
                      <InputGroupText className="ml-auto">0/120</InputGroupText>
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
                    value={field.value ?? null}
                    onChange={field.onChange}
                    disabled={addTask.isPending}
                  />
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
                    disabled={addTask.isPending}
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
                      disabled={addTask.isPending}
                      onClick={() => setNewCateg(true)}
                      className={"h-11 bg-transparent"}
                    >
                      + New
                    </Button>
                  </ToggleGroup>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </div>
    </Fragment>
  );
}
