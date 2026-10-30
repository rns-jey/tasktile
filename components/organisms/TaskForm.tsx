"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SquareIcon } from "lucide-react";
import { Fragment } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { useCategories } from "@/hooks/useCategories";
import { localDay } from "@/lib/date";
import { TaskFormValues } from "@/lib/schemas/task";
import { TaskWithCategory } from "@/types";

import { toast } from "sonner";
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
import { Separator } from "../ui/Separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";

interface TaskFormProps {
  task?: TaskWithCategory;
  form: UseFormReturn<TaskFormValues>;
  formId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewCateg: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: () => void;
}

export default function TaskForm({
  task,
  form,
  formId,
  setOpen,
  setNewCateg,
  onDelete,
}: TaskFormProps) {
  const isEditing = Boolean(task);

  const { data: categories } = useCategories();

  const description = form.watch("description") ?? "";

  const queryClient = useQueryClient();

  const addTask = useMutation<
    TaskWithCategory,
    Error,
    TaskFormValues & { scheduledOn: string }
  >({
    mutationFn: async (newTask) => {
      const response = await axios.post("/api/tasks/new", newTask);
      return response.data;
    },
    onError: () => toast.error("Couldn't save task"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      form.reset();
      setOpen(false);

      toast.success("Task created", {
        position: "top-center",
      });
    },
  });

  const updateTask = useMutation<TaskWithCategory, Error, TaskFormValues>({
    mutationFn: async (updatedTask) => {
      const response = await axios.patch(`/api/tasks/${task?.id}`, updatedTask);
      return response.data;
    },
    onError: () => toast.error("Couldn't save task"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      setOpen(false);
      toast.success("Task updated", {
        position: "top-center",
      });
    },
  });

  function onSubmit(values: TaskFormValues) {
    if (isEditing) {
      updateTask.mutate(values);
    } else {
      addTask.mutate({ ...values, scheduledOn: localDay() });
    }
  }

  const formPending = addTask.isPending || updateTask.isPending;

  return (
    <Fragment>
      <DrawerHeader className="flex flex-row items-center justify-between">
        <DrawerClose
          disabled={formPending}
          className="text-muted h-11 px-2 font-medium"
        >
          Cancel
        </DrawerClose>
        <DrawerTitle>{isEditing ? "Edit Task" : "Add Task"}</DrawerTitle>
        <Button
          type="submit"
          form={formId}
          disabled={formPending}
          className="bg-ink text-paper h-11 px-4 font-semibold"
        >
          {isEditing ? "Save" : "Add"}
        </Button>
      </DrawerHeader>

      <div className="flex flex-col items-center gap-2 px-4">
        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              disabled={formPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupAddon>
                      <SquareIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id={`${formId}-name`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Add a task name .."
                    />
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              disabled={formPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id={`${formId}-description`}
                      aria-invalid={fieldState.invalid}
                      maxLength={120}
                      placeholder="Add a description (optional)"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="ml-auto">
                        {description.length}/120
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
                    value={field.value ?? null}
                    onChange={field.onChange}
                    disabled={formPending}
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

                  <div className="flex flex-wrap gap-2">
                    <ToggleGroup
                      variant={"outline"}
                      value={field.value ? [field.value] : []}
                      onValueChange={(v) => field.onChange(v[0] ?? null)}
                      className="contents"
                      disabled={formPending}
                    >
                      {categories &&
                        categories.map((category) => (
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
                    </ToggleGroup>

                    <Button
                      variant={"outline"}
                      type="button"
                      disabled={formPending}
                      onClick={() => setNewCateg(true)}
                      className={"h-11 bg-transparent"}
                    >
                      + New
                    </Button>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        {isEditing && (
          <>
            <Separator className="my-2" />

            <DrawerClose asChild>
              <Button
                className="h-11 w-full cursor-pointer"
                variant="destructive"
                type="button"
                onClick={onDelete}
                disabled={formPending}
              >
                Delete task
              </Button>
            </DrawerClose>
          </>
        )}
      </div>
    </Fragment>
  );
}
