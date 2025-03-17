"use client";

import { TaskWithCategory } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ScrollArea } from "../atoms/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import SlideAnimation from "../atoms/slide-animation";
import { Checkbox } from "../atoms/checkbox";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Clock, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../atoms/form";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";

function formatDueDate(dueDate: Date) {
  const difference = differenceInCalendarDays(dueDate, new Date());
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const label = {
    label: "Due " + formatter.format(difference, "day"),
    color: difference === 0 ? "text-orange-400" : difference > 0 ? "text-blue-500" : difference < 0 && "text-red-500",
  };

  return label;
}

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

export default function TaskSection() {
  const [isLoading, setLoading] = useState(false);

  const { data: tasks } = useQuery<TaskWithCategory[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("/api/tasks");

      return response.data;
    },
  });

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

  const mutation = useMutation<
    TaskWithCategory,
    Error,
    {
      name: string;
      description: string;
      categoryId?: string | null;
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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  if (!tasks) return <div>Loading...</div>;

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
      {/* Add new task */}
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
        </form>
      </Form>

      {/* Active tasks */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-primary">Active Tasks</h2>

        {activeTasks.length > 0 && (
          <ScrollArea className={cn(activeTasks.length >= 5 ? "h-[300px]" : "h-fit")}>
            <AnimatePresence>
              <div className="space-y-1">
                {activeTasks.map((task) => (
                  <SlideAnimation key={task.id}>
                    <div className={`bg-${task.category?.color} absolute h-[100px] w-2`} />
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 w-full">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => {}}
                          disabled={isLoading}
                          className="cursor-pointer"
                        />

                        <div className="flex flex-col gap-1  ">
                          <div
                            className={cn(
                              task.completed && "line-through text-foreground/50",
                              "text-sm font-semibold text-left"
                            )}
                          >
                            {task.name}
                          </div>

                          <p
                            className={cn(
                              task.completed && "line-through text-foreground/50",
                              "text-xs text-left truncate w-60 md:w-72"
                            )}
                          >
                            {task.description}
                          </p>

                          <div
                            className={cn(
                              task.dueDate && formatDueDate(task.dueDate).color,
                              task.completed && "line-through text-foreground/50",
                              "flex gap-1 items-center text-xs"
                            )}
                          >
                            <Clock className="h-3 w-3" />
                            <span>{task.dueDate ? formatDueDate(task.dueDate).label : "No due date"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SlideAnimation>
                ))}
              </div>
            </AnimatePresence>
          </ScrollArea>
        )}
      </div>

      {activeTasks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">
          No active tasks. Add a new task to get started!
        </p>
      )}
    </div>
  );
}
