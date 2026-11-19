"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { flushPendingDeletes, useDeleteTask } from "@/hooks/useDeleteTask";
import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";
import { TaskWithCategory } from "@/types";

import { useCategories, useRecentCategories } from "@/hooks/useCategories";
import { toDay } from "@/lib/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ChevronRight,
  Ellipsis,
  Pencil,
  SquareIcon,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../atoms/Button";
import TaskMeta from "../molecules/TaskMeta";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Field, FieldError, FieldGroup } from "../ui/Field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "../ui/InputGroup";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";
import CalendarDrawer from "./CalendarDrawer";
import MoveTask from "./MoveTask";

type EditTaskDrawerProps = {
  task: TaskWithCategory;
  variant?: "full" | "compact";
};

export default function EditTaskDrawer({ task, variant }: EditTaskDrawerProps) {
  const compact = variant === "compact";

  const { data: categories } = useCategories();
  const { data: recentCategories } = useRecentCategories();

  const [open, setOpen] = useState(false);

  const [selectingCategory, setSelectingCategory] = useState(false);
  const [selectingStack, setSelectingStack] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const pendingDelete = useRef(false);

  const { name, description, stackId, categoryId, dueOn } = task;

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    values: {
      name,
      description,
      stackId,
      categoryId,
      dueOn: toDay(dueOn),
    },
  });

  const selectedCategoryId = taskForm.watch("categoryId");

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

  const handleDelete = () => {
    pendingDelete.current = true;
    setOpen(false);
  };

  const removeTask = useDeleteTask();

  function onSubmit(values: TaskFormValues) {
    updateTask.mutate(values);
  }

  const formPending = updateTask.isPending;

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (next) flushPendingDeletes();
        else {
          taskForm.reset();
          setSelectingStack(false);
          setSelectingCategory(false);
        }
        setOpen(next);
      }}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen && pendingDelete.current) {
          pendingDelete.current = false;
          removeTask(task);
        }
      }}
      showSwipeHandle
    >
      <DrawerTrigger
        render={
          <button
            type="button"
            className="peer-data-checked:text-muted-foreground w-full min-w-0 cursor-[inherit] text-left peer-data-checked:line-through"
          >
            <p className="truncate font-medium">{task.name}</p>
            {task.description && (
              <p className="text-ink/90 truncate text-sm">{task.description}</p>
            )}
            <TaskMeta task={task} />
          </button>
        }
      />

      <DrawerContent className="pb-4" aria-describedby={undefined}>
        <DrawerHeader className="flex flex-row items-center justify-between pt-2 pb-4">
          <MoveTask
            selectingStack={selectingStack}
            setSelectingStack={setSelectingStack}
            task={task}
            onMoved={() => setOpen(false)}
          />

          {isEditing ? (
            <Button
              className="px-4"
              type="submit"
              form={"formEditTask"}
              disabled={formPending}
            >
              Save
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="size-11 rounded-lg"
                  />
                }
              >
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Pencil /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive"
                  >
                    <Trash /> Delete task
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </DrawerHeader>

        <div className="flex flex-col items-center gap-2 px-4">
          <form
            id="formEditTask"
            onSubmit={taskForm.handleSubmit(onSubmit)}
            className="w-full"
          >
            <FieldGroup>
              <Controller
                name="name"
                control={taskForm.control}
                disabled={formPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup>
                      <InputGroupAddon>
                        <SquareIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id={`formEditTask-name`}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="Add a task name .."
                        onFocus={() => setIsEditing(true)}
                        onBlur={() => setIsEditing(false)}
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
                control={taskForm.control}
                disabled={formPending}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id={`formEditTask-name`}
                        aria-invalid={fieldState.invalid}
                        maxLength={120}
                        placeholder="Add a description (optional)"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <CalendarDrawer value={task.dueOn} task={task} />

              <Controller
                name="categoryId"
                control={taskForm.control}
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
