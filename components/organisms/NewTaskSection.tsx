import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, Text } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldGroup } from "@/components/ui/Field";

import { useCategories } from "@/hooks/useCategories";

import type { TaskWithCategory } from "@/types";

import DatePicker from "../molecules/DatePicker";
import DropdownCategory from "../molecules/DropdownCategory";
import { Input } from "../ui/Input";
import { InputGroup, InputGroupTextarea } from "../ui/InputGroup";

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string(),
  categoryId: z.string().nullable(),
  dueDate: z.date().optional(),
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
      dueDate: undefined,
    },
  });

  const queryClient = useQueryClient();

  const addTask = useMutation<
    TaskWithCategory,
    Error,
    {
      name: string;
      description: string;
      categoryId: string | null;
      dueDate?: Date | undefined;
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

  if (categories) {
    return (
      <div>
        <h2>Tasks</h2>

        <div className="flex gap-2">
          <div className="w-full">
            <form
              id="form-add-task"
              onSubmit={form.handleSubmit(onSubmit, (errors) =>
                console.log("Validation errors:", errors),
              )}
            >
              <FieldGroup className="gap-2">
                <Controller
                  name="name"
                  control={form.control}
                  disabled={addTask.isPending}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        {...field}
                        id="form-add-task-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Add a task name .."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <div className="grid w-full grid-cols-3 gap-2">
                    <Button
                      variant={"outline"}
                      size={"xs"}
                      type="button"
                      disabled={addTask.isPending}
                      onClick={() => setDescribing(!isDescribing)}
                    >
                      <Text />
                      {isDescribing ? "Hide description" : "Add description"}
                    </Button>

                    <Controller
                      name="categoryId"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <DropdownCategory
                            categories={categories}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={addTask.isPending}
                            size="xs"
                          />
                        </Field>
                      )}
                    />

                    {/* <DropdownDueDate
                      selected={selectedDate}
                      setDate={setDate}
                      disabled={addTask.isPending}
                      size="xs"
                    /> */}

                    <Controller
                      name="dueDate"
                      control={form.control}
                      disabled={addTask.isPending}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <DatePicker
                            size="xs"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={addTask.isPending}
                          />
                        </Field>
                      )}
                    />
                  </div>

                  {isDescribing && (
                    <Controller
                      name="description"
                      control={form.control}
                      disabled={addTask.isPending}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <InputGroup>
                            <InputGroupTextarea
                              {...field}
                              id="form-add-task-description"
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
                  )}
                </div>
              </FieldGroup>
            </form>
          </div>

          <Button
            type="submit"
            form="form-add-task"
            disabled={addTask.isPending}
          >
            <Plus />
          </Button>
        </div>
      </div>
    );
  }
}
