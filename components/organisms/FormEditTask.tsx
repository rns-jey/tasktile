import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useCategories } from "@/hooks/useCategories";
import { TaskWithCategory } from "@/types";

import CalendarDueDate from "@/components/molecules/CalendarDueDate";
import DropdownDueDate from "@/components/molecules/DropdownDueDate";

import { Button } from "@/components/ui/Button";
import { DrawerClose, DrawerFooter } from "@/components/ui/Drawer";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/InputGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface FormEditTaskProps {
  task: TaskWithCategory;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string(),
  categoryId: z.string().optional(),
  dueDate: z.date().nullable(),
});

export default function FormEditTask({ task, setOpen }: FormEditTaskProps) {
  const { name, description, categoryId, dueDate } = task;

  const { data: categories } = useCategories();

  const [selectedDate, setDate] = useState<Date | null>(
    dueDate ? new Date(dueDate) : null,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      description: description,
      categoryId: categoryId ? categoryId : undefined,
      dueDate: selectedDate ? new Date(selectedDate) : null,
    },
  });

  useEffect(() => {
    form.setValue("dueDate", selectedDate);
  }, [selectedDate]);

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
      form.reset();
      setDate(null);
      setOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateTask.mutate(values);
  }

  return (
    <>
      <div className="p-4">
        <form id="form-edit-task" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-2">
            <Controller
              name="name"
              control={form.control}
              disabled={updateTask.isPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-edit-task-title">Name</FieldLabel>
                  <h1>{updateTask.isPending}</h1>
                  <Input
                    {...field}
                    id="form-edit-task-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Add a task name .."
                  />
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
                      placeholder="Provide a brief description of the task .."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </InputGroup>
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor="form-edit-task-category">
                      Category
                    </FieldLabel>

                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-edit-task-category"
                        aria-invalid={fieldState.invalid}
                        disabled={updateTask.isPending}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {categories &&
                          categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                              className="dark:hover:bg-accent flex items-center"
                              onClick={() =>
                                form.setValue("categoryId", category.id)
                              }
                            >
                              <div
                                className={`rounded-full bg-${category.color} h-3 w-3 shrink-0`}
                              />
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Due date</FieldLabel>

              <DropdownDueDate
                selected={selectedDate}
                setDate={setDate}
                disabled={updateTask.isPending}
                size="default"
              >
                <CalendarDueDate selected={selectedDate} setDate={setDate} />
              </DropdownDueDate>
            </Field>
          </FieldGroup>
        </form>
      </div>
      <DrawerFooter>
        <Button
          type="submit"
          form="form-edit-task"
          disabled={updateTask.isPending}
        >
          Submit
        </Button>
        <DrawerClose asChild>
          <Button variant="outline" disabled={updateTask.isPending}>
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}
