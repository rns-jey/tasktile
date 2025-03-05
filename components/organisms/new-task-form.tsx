"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormMessage } from "../atoms/form";
import { Input } from "../atoms/input";
import { CalendarIcon, Plus, Tag, Text, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Calendar } from "../atoms/calendar";
import { Button } from "../atoms/button";

import { toast } from "sonner";

import { format } from "date-fns";

import axios from "axios";

import { Task } from "@prisma/client";

import { Separator } from "../atoms/separator";

import NewCategoryForm from "../molecules/new-category-form";

const formSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  categoryId: z.string().nullish(),
  dueDate: z.union([
    z.date(),
    z.null(),
    z.undefined(), // Allow null values
  ]),
});

interface NewTaskFormProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function NewTaskForm({ tasks, setTasks }: NewTaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: null,
      dueDate: null,
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("api/task/new", values);
      const newTask = response.data;

      setTasks([newTask, ...tasks]);
      toast("Task created.");
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Add a new task..."
                    autoComplete="off"
                    className="flex-1"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" size="icon" disabled={isLoading}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant={"outline"} size={"xs"}>
            <Text />
            <span className="text-xs">Add description</span>
          </Button>

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} size={"xs"} disabled={isLoading} className="flex items-center">
                        <Tag />
                        <span className="text-xs">Add category</span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2 space-y-2" align="start">
                    <div className="flex items-center gap-1">
                      <div className="rounded-full bg-red-500 h-3 w-3" />
                      <span className="text-sm">category</span>
                    </div>

                    <Separator />

                    <NewCategoryForm />

                    <div className="flex items-center gap-1">
                      <Plus className="h-3 w-3" />
                      <span className="text-sm">New category</span>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} size={"xs"} disabled={isLoading} className="flex items-center">
                        <CalendarIcon />
                        <span className="text-xs">{field.value ? format(field.value, "LLL dd") : "Pick a date"}</span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                      footer={
                        <>
                          <Separator className="my-2" />

                          <div className="flex justify-between">
                            <Button
                              type="button"
                              variant={"outline"}
                              size={"xs"}
                              className="p-1"
                              onClick={() => form.setValue("dueDate", null)}
                            >
                              <span className="text-xs">No due date</span>
                            </Button>

                            <Button
                              type="button"
                              variant={"outline"}
                              size={"xs"}
                              className="p-1"
                              onClick={() => form.setValue("dueDate", new Date())}
                            >
                              <span className="text-xs">Today</span>
                            </Button>

                            <Button
                              type="button"
                              variant={"outline"}
                              size={"xs"}
                              className="p-1"
                              onClick={() =>
                                form.setValue("dueDate", new Date(new Date().setDate(new Date().getDate() + 1)))
                              }
                            >
                              <span className="text-xs">Tomorrow</span>
                            </Button>
                          </div>
                        </>
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
