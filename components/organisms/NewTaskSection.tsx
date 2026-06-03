import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, Text } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import CalendarDueDate from "@/components/molecules/CalendarDueDate";
import InputTaskName from "@/components/molecules/FormInputTaskName";
import FormSelectCategory from "@/components/molecules/FormSelectCategory";
import FormTextareaDescription from "@/components/molecules/FormTextareaDescription";

import { Button } from "@/components/ui/Button";
import { Field, FieldGroup } from "@/components/ui/Field";

import { useCategories } from "@/hooks/useCategories";

import type { TaskWithCategory } from "@/types";

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string(),
  categoryId: z.string().nullable(),
  dueDate: z.date().nullable(),
});

export default function NewTaskSection() {
  const [isDescribing, setDescribing] = useState(false);

  const { data: categories } = useCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    {
      name: string;
    }
  >({
    mutationFn: async (newTask) => {
      const response = await axios.post("api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      form.reset();
      setDescribing(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTask.mutate(values);
  }

  return (
    <div>
      <h2>Tasks</h2>

      <div className="flex gap-2">
        <div className="w-full">
          <form id="form-add-task" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-2">
              <InputTaskName
                id="form-add-task-name"
                name="name"
                control={form.control}
                disabled={addTask.isPending}
                placeholder="Add a task name .."
              />

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant={"outline"}
                    size={"xs"}
                    type="button"
                    className="w-fit"
                    disabled={addTask.isPending}
                    onClick={() => setDescribing(!isDescribing)}
                  >
                    <Text />
                    {isDescribing ? "Hide description" : "Add description"}
                  </Button>

                  <FormSelectCategory
                    name="categoryId"
                    control={form.control}
                    id="form-add-task-category"
                    disabled={addTask.isPending}
                  />

                  <Controller
                    name="dueDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <CalendarDueDate
                          {...field}
                          id="form-add-task-due-date"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={addTask.isPending}
                        />
                      </Field>
                    )}
                  />
                </div>

                {isDescribing && (
                  <FormTextareaDescription
                    name="description"
                    control={form.control}
                    disabled={addTask.isPending}
                    id="form-add-task-description"
                    placeholder="Provide a brief description of the task .."
                  />
                )}
              </div>
            </FieldGroup>
          </form>
        </div>

        <Button type="submit" form="form-add-task" disabled={addTask.isPending}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}
