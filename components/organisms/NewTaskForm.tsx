"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { AlignLeftIcon, ArrowUp, FolderKanbanIcon, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { localDay } from "@/lib/date";
import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";
import { TaskWithCategory } from "@/types";

import { toast } from "sonner";
import { Button } from "../atoms/Button";
import DatePicker from "../molecules/DatePicker";
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

export default function NewTaskForm() {
  const [described, setDescribed] = useState(false);

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: null,
      dueOn: localDay(),
    },
  });

  const queryClient = useQueryClient();

  const addTask = useMutation<TaskWithCategory, Error, TaskFormValues>({
    mutationFn: async (newTask) => {
      const response = await axios.post("/api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      taskForm.reset({
        name: "",
        description: "",
        categoryId: null,
        dueOn: localDay(),
      });
      taskForm.setFocus("name");
      setDescribed(false);
      toast.success("Task created", {
        position: "top-center",
      });
    },
    onError: () => toast.error("Couldn't save task"),
  });

  function onSubmit(values: TaskFormValues) {
    addTask.mutate(values);
  }

  const taskName = !taskForm.watch("name").trim().length;

  return (
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
                <DropdownMenuItem onClick={() => setDescribed(!described)}>
                  <AlignLeftIcon /> Description
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="button" variant="secondary" className="h-10">
            <FolderKanbanIcon /> Project
          </Button>

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
          className="size-10 rounded-full"
          disabled={taskName || addTask.isPending}
          onPointerDown={(e) => e.preventDefault()}
        >
          <ArrowUp />
        </Button>
      </div>
    </form>
  );
}
