"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ChevronRight, SquareIcon } from "lucide-react";
import { Fragment, useMemo } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { useCategories, useRecentCategories } from "@/hooks/useCategories";
import { TaskFormValues } from "@/lib/schemas/task";
import { TaskWithCategory } from "@/types";

import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Button } from "../atoms/Button";
import DatePicker from "../molecules/DatePicker";
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
  setSelectingCategory: React.Dispatch<React.SetStateAction<boolean>>;
  setNewCateg: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: () => void;
}

export default function TaskForm({
  task,
  form,
  formId,
  setOpen,
  setNewCateg,
  setSelectingCategory,
  onDelete,
}: TaskFormProps) {
  const isEditing = Boolean(task);

  const { data: categories } = useCategories();
  const { data: recentCategories } = useRecentCategories();

  const description = form.watch("description") ?? "";
  const selectedCategoryId = form.watch("categoryId");

  const chips = useMemo(() => {
    if (!recentCategories) return [];
    if (
      !selectedCategoryId ||
      recentCategories.some((c) => c.id === selectedCategoryId)
    )
      return recentCategories;

    const selectedCategory = categories?.find(
      (c) => c.id === selectedCategoryId,
    );

    return selectedCategory
      ? [selectedCategory, ...recentCategories]
      : recentCategories;
  }, [recentCategories, categories, selectedCategoryId]);

  const queryClient = useQueryClient();

  const addTask = useMutation<TaskWithCategory, Error, TaskFormValues>({
    mutationFn: async (newTask) => {
      const response = await axios.post("/api/tasks/new", newTask);
      return response.data;
    },
    onError: () => toast.error("Couldn't save task"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
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
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
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
      addTask.mutate(values);
    }
  }

  const formPending = addTask.isPending || updateTask.isPending;

  return (
    <Fragment>
      <DrawerHeader className="flex flex-row items-center justify-between py-4">
        <DrawerClose
          disabled={formPending}
          className="text-muted-foreground h-11 px-2 font-medium"
        >
          Cancel
        </DrawerClose>
        <DrawerTitle>{isEditing ? "Edit Task" : "Add Task"}</DrawerTitle>
        <Button
          className="px-4"
          type="submit"
          form={formId}
          disabled={formPending}
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
              name="dueOn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <DatePicker
                    value={field.value ? parseISO(field.value) : null}
                    onChange={(d) =>
                      field.onChange(d ? format(d, "yyyy-MM-dd") : null)
                    }
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
                  <div className="flex items-center justify-between">
                    <span className="text-label font-medium tracking-[.08em] uppercase">
                      Category · optional
                    </span>
                    <Button
                      variant="link"
                      type="button"
                      className="h-11"
                      onClick={() => setSelectingCategory(true)}
                    >
                      All {categories?.length} <ChevronRight />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 pb-4">
                    <ToggleGroup
                      variant={"outline"}
                      value={field.value ? [field.value] : []}
                      onValueChange={(v) => field.onChange(v[0] ?? null)}
                      className="contents"
                      disabled={formPending}
                    >
                      {chips.map((category) => (
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
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        {isEditing && (
          <>
            <Separator className="my-2" />

            <DrawerClose
              render={
                <Button
                  className="h-11 w-full cursor-pointer"
                  variant="destructive"
                  type="button"
                  onClick={onDelete}
                  disabled={formPending}
                >
                  Delete task
                </Button>
              }
            />
          </>
        )}
      </div>
    </Fragment>
  );
}
