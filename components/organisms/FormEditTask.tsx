import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useCategories } from "@/hooks/useCategories";
import { TaskWithCategory } from "@/types";

import DropdownDueDate from "@/components/molecules/DropdownDueDate";

import { Button } from "@/components/ui/Button";
import { DrawerClose, DrawerFooter } from "@/components/ui/Drawer";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/InputGroup";
import DropdownCategory from "../molecules/DropdownCategory";

interface FormEditTaskProps {
  task: TaskWithCategory;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string(),
  categoryId: z.string().nullable(),
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

  if (task && categories) {
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
                    <FieldLabel>Description</FieldLabel>

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

              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="categoryId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Category</FieldLabel>

                      {/* <CategoryPopover
                        task={task}
                        categories={categories}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={updateTask.isPending}
                      /> */}

                      <DropdownCategory
                        categories={categories}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={updateTask.isPending}
                      />
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel>Due date</FieldLabel>

                  <DropdownDueDate
                    selected={selectedDate}
                    setDate={setDate}
                    disabled={updateTask.isPending}
                  />
                </Field>
              </div>
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
}
