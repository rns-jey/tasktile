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
import { Textarea } from "@/components//ui/TextArea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components//ui/Select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components//ui/Popover";
import { Button } from "@/components//ui/Button";
import { Calendar } from "@/components//ui/Calendar";
import { Separator } from "@/components//ui/Separator";
import { CardContent, CardFooter } from "@/components/ui/Card";

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

const colors = [
  { name: "red-500", bg: "bg-red-500" },
  { name: "orange-500", bg: "bg-orange-500" },
  { name: "yellow-500", bg: "bg-yellow-500" },
  { name: "green-500", bg: "bg-green-500" },
  { name: "blue-500", bg: "bg-blue-500" },
  { name: "indigo-500", bg: "bg-indigo-500" },
  { name: "purple-500", bg: "bg-purple-500" },
  { name: "pink-500", bg: "bg-pink-500" },
];

export default function NewTaskForm({ setIsOpen }: NewTaskFormProps) {
  const [selectedColor, setColor] = React.useState("red-500");

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
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-task-name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-add-task-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Add a new task ..."
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
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-add-task-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-add-task-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Add a description ..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-2">
              <div className="flex w-full flex-col gap-2">
                <Controller
                  name="categoryId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="form-add-task-categoryId">
                        Category
                      </FieldLabel>
                      <Select
                        {...field}
                        value={field.value || undefined}
                        onValueChange={field.onChange}
                        onOpenChange={() => field.onBlur()}
                      >
                        <SelectTrigger id="form-add-task-categoryId">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {categories &&
                              categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  <div>yes</div>
                                  {category.name}
                                </SelectItem>
                              ))}
                            <SelectItem key="other" value="other">
                              other
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                {form.watch("categoryId") === "other" && (
                  <Controller
                    name="categoryName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-add-task-categoryName">
                          Category Name
                        </FieldLabel>
                        <div className="flex flex-col gap-1">
                          <Input
                            {...field}
                            id="form-add-task-categoryName"
                            aria-invalid={fieldState.invalid}
                            placeholder="Add a new category ..."
                          />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}

                          <div className="grid grid-cols-6 gap-1">
                            {colors.map((color, id) => (
                              <div
                                key={`color_${id}`}
                                className={cn(
                                  selectedColor !== color.name &&
                                    "border-transparent",
                                  "rounded-full border-2 p-1",
                                )}
                                onClick={() => {
                                  form.setValue("categoryColor", color.name);
                                  setColor(color.name);
                                }}
                              >
                                <div
                                  className={`${color.bg} h-5 w-5 cursor-pointer rounded-full`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </Field>
                    )}
                  />
                )}
              </div>

              <Controller
                name="dueDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="form-add-task-dueDate">
                      Due Date
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-start gap-2"
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {field.value
                            ? field.value.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          {...field}
                          id="form-add-task-dueDate"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          className="w-full"
                        />
                        <Separator />
                        <div className="flex justify-between gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange(null)}
                          >
                            No due date
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange(new Date())}
                          >
                            Today
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              field.onChange(
                                new Date(
                                  new Date().setDate(new Date().getDate() + 1),
                                ),
                              )
                            }
                          >
                            Tomorrow
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </Field>
                )}
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
