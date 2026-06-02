import React from "react";
import axios from "axios";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskWithCategory } from "@/types";
import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";

import { CalendarIcon } from "lucide-react";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/Field";
import { Input } from "@/components//ui/Input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components//ui/Popover";
import { Button } from "@/components//ui/Button";
import { Calendar } from "@/components//ui/Calendar";
import { Separator } from "@/components//ui/Separator";
import { CardContent, CardFooter } from "@/components/ui/Card";
import InputTaskName from "@/components/molecules/InputTaskName";
import TextAreaDescription from "../molecules/TextAreaDescription";
import SelectCategory from "../molecules/SelectCategory";
import InputCategory from "../molecules/InputCategory";
import CalendarDueDate from "../molecules/CalendarDueDate";

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

    dueDate: z.date().optional(),
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

      dueDate: undefined,
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");

      return response.data;
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
                  categories={categories}
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
