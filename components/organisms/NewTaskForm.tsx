import axios from "axios";
import React from "react";

import { TaskWithCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components//ui/Button";
import { CardContent, CardFooter } from "@/components/ui/Card";
import { FieldGroup } from "@/components/ui/Field";

import CalendarDueDate from "@/components/molecules/CalendarDueDate";
import InputCategory from "@/components/molecules/InputCategory";
import InputTaskName from "@/components/molecules/InputTaskName";
import SelectCategory from "@/components/molecules/SelectCategory";
import TextAreaDescription from "@/components/molecules/TextAreaDescription";

interface NewTaskFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z
  .object({
    name: z.string().min(3, "Task name is required"),
    description: z.string(),

    categoryId: z.string().nullish(),
    categoryName: z.string(),
    categoryColor: z.string(),

    dueDate: z.date().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.categoryId === "other" && !data.categoryName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryName"],
        message: "Category name is required",
      });
    }
  });

export default function NewTaskForm({ setIsOpen }: NewTaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",

      categoryId: "",
      categoryName: "",
      categoryColor: "red-500",

      dueDate: null,
    },
  });

  const queryClient = useQueryClient();

  const addTask = useMutation<
    TaskWithCategory,
    Error,
    {
      name: string;
      description?: string;
      categoryId?: string | null;
      categoryName?: string;
      categoryColor?: string;
      dueDate?: Date | null;
    }
  >({
    mutationFn: async (newTask) => {
      const response = await axios.post("api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      await queryClient.invalidateQueries({ queryKey: ["categories"] }); // Wait for refetch to complete
      form.reset();
      setIsOpen(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTask.mutate(values);
  }

  return (
    <>
      <CardContent>
        <form id="form-add-task" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <InputTaskName
              id="form-add-task-name"
              name="name"
              control={form.control}
              label="Name"
              placeholder="Add a task name .."
            />

            <TextAreaDescription
              id="form-add-task-description"
              name="description"
              control={form.control}
              label="Description"
              placeholder="Add a description ..."
            />

            <div className="flex gap-2">
              <div className="flex w-full flex-col gap-2">
                <SelectCategory
                  id="form-add-task-categoryId"
                  name="categoryId"
                  control={form.control}
                  label="Category"
                  placeholder="Select a category"
                />

                {form.watch("categoryId") === "other" && (
                  <InputCategory
                    id="form-add-task-category-name"
                    name="categoryName"
                    control={form.control}
                    label="Category name"
                    placeholder="Add a new category ..."
                    setValue={form.setValue}
                  />
                )}
              </div>

              <CalendarDueDate
                id="form-add-task-dueDate"
                name="dueDate"
                control={form.control}
                label="Due Date"
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button type="submit" form="form-add-task" disabled={addTask.isPending}>
          Create
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={addTask.isPending}
        >
          Cancel
        </Button>
      </CardFooter>
    </>
  );
}
