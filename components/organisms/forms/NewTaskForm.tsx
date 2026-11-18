import { Button } from "@/components/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Field, FieldGroup } from "@/components/ui/Field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/InputGroup";
import { useStacks } from "@/hooks/useStacks";
import { localDay } from "@/lib/date";
import { TaskFormValues } from "@/lib/schemas/task";
import { TaskWithCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { AlignLeftIcon, ArrowUp, FolderKanbanIcon, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import CalendarDrawer from "../CalendarDrawer";

type NewTaskFormProps = {
  form: UseFormReturn<TaskFormValues>;
  urlStackId: string | undefined;
};

export default function NewTaskForm({ form, urlStackId }: NewTaskFormProps) {
  const pathname = usePathname();
  const [described, setDescribed] = useState(false);

  const { data: stacks = [] } = useStacks();

  const selectedStackId = form.watch("stackId");
  const stackLabel =
    stacks.find((s) => s.id === selectedStackId)?.name ?? "Inbox";

  const taskName = !form.watch("name").trim().length;

  const queryClient = useQueryClient();

  const addTask = useMutation<TaskWithCategory, Error, TaskFormValues>({
    mutationFn: async (newTask) => {
      const response = await axios.post("/api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      form.reset({
        name: "",
        description: "",
        stackId: form.getValues("stackId"),
        categoryId: null,
        dueOn: (pathname === "/" && localDay()) || null,
      });
      form.setFocus("name");
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

  return (
    <form
      id="newTaskForm"
      className="space-y-5 px-2.5 py-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="gap-0">
        <Controller
          name="name"
          control={form.control}
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
            control={form.control}
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
                    if (described) form.setValue("description", "");
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
                <Button type="button" variant="secondary" className="h-10" />
              }
            >
              <FolderKanbanIcon /> {stackLabel}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    form.setValue("stackId", null);
                  }}
                >
                  Inbox
                </DropdownMenuItem>
                {stacks.map((stack) => (
                  <DropdownMenuItem
                    key={stack.id}
                    onClick={() => {
                      form.setValue("stackId", stack.id);
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
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <CalendarDrawer
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
  );
}
