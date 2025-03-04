"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormMessage } from "../atoms/form";
import { Input } from "../atoms/input";
import { CalendarIcon, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Calendar } from "../atoms/calendar";
import { Button } from "../atoms/button";

import { toast } from "sonner";

import { format } from "date-fns";

import axios from "axios";

import { Task } from "@prisma/client";
import { Label } from "../atoms/label";

const formSchema = z.object({
  name: z.string().min(3),
  dueDate: z
    .union([
      z.date(),
      z.null(), // Allow null values
    ])
    .refine((date) => date === null || date >= new Date(new Date().setDate(new Date().getDate() - 1)), {
      message: "Due date cannot be in the past",
    }),
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
      dueDate: null,
    },
  });

  const selectedDate = form.watch("dueDate");
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

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} disabled={isLoading}>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="icon" disabled={isLoading}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {selectedDate && (
          <div className="flex space-x-1 items-center">
            <Label>Selected date: {format(selectedDate, "PPP")}</Label>
            <X onClick={() => form.setValue("dueDate", null)} className="h-5 w-5 text-red-500 cursor-pointer" />
          </div>
        )}
      </form>
    </Form>
  );
}
