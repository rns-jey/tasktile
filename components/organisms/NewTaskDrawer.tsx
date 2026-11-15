"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { AlignLeftIcon, ArrowUp, FolderKanbanIcon, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";

import { useStacks } from "@/hooks/useStacks";
import { localDay } from "@/lib/date";
import { cn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { toast } from "sonner";
import { Button } from "../atoms/Button";
import DatePicker from "../molecules/DatePicker";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Field, FieldGroup } from "../ui/Field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "../ui/InputGroup";

export default function NewTaskDrawer() {
  const [open, setOpen] = useState(false);
  const { stackId: urlStackId } = useParams<{ stackId?: string }>();

  const [described, setDescribed] = useState(false);

  const { data: stacks = [] } = useStacks();

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      stackId: urlStackId ?? null,
      categoryId: null,
      dueOn: localDay(),
    },
  });

  const selectedStackId = taskForm.watch("stackId");
  const stackLabel =
    stacks.find((s) => s.id === selectedStackId)?.name ?? "Inbox";

  const taskName = !taskForm.watch("name").trim().length;

  const queryClient = useQueryClient();

  const addTask = useMutation<TaskWithCategory, Error, TaskFormValues>({
    mutationFn: async (newTask) => {
      const response = await axios.post("/api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      taskForm.reset({
        name: "",
        description: "",
        stackId: taskForm.getValues("stackId"),
        categoryId: null,
        dueOn: localDay(),
      });
      taskForm.setFocus("name");
      setDescribed(false);

      const here = urlStackId ?? null;
      const name = stacks.find((s) => s.id === task.stackId)?.name ?? "Inbox";
      toast.success(
        task.stackId === here ? "Task created" : `Task added to ${name}`,
        {
          position: "top-center",
        },
      );
    },
    onError: () => toast.error("Couldn't save task"),
  });

  function onSubmit(values: TaskFormValues) {
    addTask.mutate(values);
  }

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
        // if (!next) setSelectingCategory(false);
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
      <DrawerContent>
        <form
          id="newTaskForm"
          className="space-y-5 px-2.5 py-2"
          onSubmit={taskForm.handleSubmit(onSubmit)}
        >
          <FieldGroup className="gap-0">
            <Controller
              name="name"
              control={taskForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="border-none has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                    <InputGroupInput
                      {...field}
                      id="newTaskForm-name"
                      readOnly={addTask.isPending}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g., Daily stand-up meeting at 930"
                      className="font-medium"
                    />
                  </InputGroup>
                </Field>
              )}
            />

            {described && (
              <Controller
                name="description"
                control={taskForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroup className="border-none has-[[data-slot=input-group-control]:focus-visible]:ring-0">
                      <InputGroupTextarea
                        {...field}
                        id="newTaskForm-description"
                        readOnly={addTask.isPending}
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                        placeholder="Description (optional)"
                        className="text-sm"
                      />
                    </InputGroup>
                  </Field>
                )}
              />
            )}
          </FieldGroup>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="secondary"
                      className="size-10 rounded-full"
                    />
                  }
                >
                  <Plus />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        if (described) taskForm.setValue("description", "");
                        setDescribed(!described);
                      }}
                    >
                      <AlignLeftIcon /> Description
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-10"
                    />
                  }
                >
                  <FolderKanbanIcon /> {stackLabel}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        taskForm.setValue("stackId", null);
                      }}
                    >
                      Inbox
                    </DropdownMenuItem>
                    {stacks.map((stack) => (
                      <DropdownMenuItem
                        key={stack.id}
                        onClick={() => {
                          taskForm.setValue("stackId", stack.id);
                        }}
                      >
                        {stack.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Controller
                name="dueOn"
                control={taskForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <DatePicker
                      value={field.value ? parseISO(field.value) : null}
                      onChange={(d) =>
                        field.onChange(d ? format(d, "yyyy-MM-dd") : null)
                      }
                      disabled={addTask.isPending}
                    />
                  </Field>
                )}
              />
            </div>

            <Button
              type="submit"
              form="newTaskForm"
              className="size-10 rounded-full"
              disabled={taskName || addTask.isPending}
              onPointerDown={(e) => e.preventDefault()}
            >
              <ArrowUp />
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
