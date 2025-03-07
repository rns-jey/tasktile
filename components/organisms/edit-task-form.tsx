"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../atoms/form";
import { Category, Task } from "@prisma/client";
import { Input } from "../atoms/input";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "../atoms/calendar";
import { Textarea } from "../atoms/textarea";
import { Separator } from "../atoms/separator";
import axios from "axios";
import { toast } from "sonner";
import { TaskWithCategory } from "@/types";
import CategoryPopOver from "./category-pop-over";
import { useEffect, useState } from "react";
import { DrawerClose } from "../atoms/drawer";

interface EditTaskFormProps {
  task: TaskWithCategory;
  tasks: TaskWithCategory[];
  setTasks: React.Dispatch<React.SetStateAction<TaskWithCategory[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  categoryId: z.string().nullish(),
  dueDate: z
    .union([
      z.date(),
      z.null(), // Allow null values
    ])
    .refine((date) => date === null || date >= new Date(new Date().setDate(new Date().getDate() - 1)), {
      message: "Due date cannot be in the past",
    }),
});

export default function EditTaskForm({ task, tasks, setTasks, categories, setCategories, setOpen }: EditTaskFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(task.category);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: task.name,
      description: task.description,
      categoryId: task.categoryId,
      dueDate: task.dueDate && new Date(task.dueDate),
    },
  });

  useEffect(() => {
    form.setValue("categoryId", selectedCategory?.id);
  }, [selectedCategory]);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const id = task.id;

      const response = await axios.patch(`/api/task/${task.id}`, values);
      const updatedTask = response.data;

      setTasks(
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                name: updatedTask.name,
                description: updatedTask.description,
                category: updatedTask.category,
                dueDate: updatedTask.dueDate,
              }
            : task
        )
      );

      setOpen(false);
      toast("Task updated.");
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form className="px-4 flex flex-col space-y-4 grow overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input task name"
                  autoComplete="off"
                  className="flex-1"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide a brief description of the task..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CategoryPopOver
          isLoading={isLoading}
          categories={categories}
          setCategories={setCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due date</FormLabel>
              <div className="flex items-center space-x-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                  </PopoverContent>
                </Popover>

                {field.value && (
                  <X onClick={() => form.setValue(field.name, null)} className="h-5 w-5 text-red-500 cursor-pointer" />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex flex-col gap-2 mb-4">
          <Button type="submit">Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </div>
      </form>
    </Form>
  );
}
