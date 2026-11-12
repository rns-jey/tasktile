import { taskFormSchema, TaskFormValues } from "@/lib/schemas/task";
import { zodResolver } from "@hookform/resolvers/zod";

import { localDay } from "@/lib/date";
import { TaskWithCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowUp, Calendar, FolderKanbanIcon, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../atoms/Button";
import { Field, FieldGroup } from "../ui/Field";
import { InputGroup, InputGroupInput } from "../ui/InputGroup";

export default function NewTaskForm() {
  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: null,
      dueDate: null,
    },
  });

  const queryClient = useQueryClient();

  const addTask = useMutation<
    TaskWithCategory,
    Error,
    TaskFormValues & { scheduledOn: string },
    { previous?: TaskWithCategory[] }
  >({
    mutationFn: async (newTask) => {
      const response = await axios.post("/api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      taskForm.reset();
    },
    onError: () => toast.error("Couldn't save task"),
  });

  function onSubmit(values: TaskFormValues) {
    addTask.mutate({ ...values, scheduledOn: localDay() });
  }

  const taskName = !taskForm.watch("name").trim().length;

  return (
    <form
      id="newTaskForm"
      className="px-2.5 py-2"
      onSubmit={taskForm.handleSubmit(onSubmit)}
    >
      <FieldGroup>
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
                />
              </InputGroup>
            </Field>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="secondary"
              className="size-10 rounded-full"
            >
              <Plus />
            </Button>

            <Button type="button" variant="secondary" className="h-10">
              <FolderKanbanIcon /> Project
            </Button>

            <Button type="button" variant="secondary" className="h-10">
              <Calendar /> Due date
            </Button>
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
      </FieldGroup>
    </form>
  );
}
