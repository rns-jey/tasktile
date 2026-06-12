import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useCategories } from "@/hooks/useCategories";
import { TaskWithCategory } from "@/types";

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
import DatePicker from "../molecules/DatePicker";
import DropdownCategory from "../molecules/DropdownCategory";

interface FormEditTaskProps {
  task: TaskWithCategory;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string(),
  categoryId: z.string().nullable(),
  dueDate: z.date().optional(),
});

export default function FormEditTask({ task, setOpen }: FormEditTaskProps) {
  const { name, description, categoryId, dueDate } = task;

  const { data: categories } = useCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      description: description,
      categoryId: categoryId,
      dueDate: dueDate ? dueDate : undefined,
    },
  });

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
          <form
            id="form-edit-task"
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log("Validation errors:", errors),
            )}
          >
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

                      <DropdownCategory
                        categories={categories}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={updateTask.isPending}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="dueDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Due date</FieldLabel>

                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={updateTask.isPending}
                      />
                    </Field>
                  )}
                />
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
