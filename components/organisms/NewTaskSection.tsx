import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, Text } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Field, FieldError, FieldGroup } from "@/components/ui/Field";

import { useCategories } from "@/hooks/useCategories";

import CalendarDueDate from "@/components/molecules/CalendarDueDate";
import type { TaskWithCategory } from "@/types";
import { Category } from "@prisma/client";
import DropdownDueDate from "../molecules/DropdownDueDate";
import SelectCategory from "../molecules/SelectCategory";
import { Input } from "../ui/Input";
import { InputGroup, InputGroupTextarea } from "../ui/InputGroup";

const formSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string(),
  categoryId: z.string().nullable(),
  dueDate: z.date().nullable(),
});

export default function NewTaskSection() {
  const [isDescribing, setDescribing] = useState(false);
  const [selectedCategory, setCategory] = useState<Category | null>(null);
  const [selectedDate, setDate] = useState<Date | null>(null);

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

  useEffect(() => {
    form.setValue("categoryId", selectedCategory ? selectedCategory.id : null);
  }, [selectedCategory]);

  useEffect(() => {
    form.setValue("dueDate", selectedDate);
  }, [selectedDate]);

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
      setCategory(null);
      setDate(null);
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

                  <SelectCategory
                    selected={selectedCategory}
                    setCategory={setCategory}
                    disabled={addTask.isPending}
                  />

                  <DropdownDueDate
                    selected={selectedDate}
                    setDate={setDate}
                    disabled={addTask.isPending}
                    size="xs"
                  >
                    <CalendarDueDate
                      selected={selectedDate}
                      setDate={setDate}
                    />
                  </DropdownDueDate>
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

        <Button type="submit" form="form-add-task" disabled={addTask.isPending}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}
