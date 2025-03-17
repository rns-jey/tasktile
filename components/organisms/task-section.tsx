"use client";

import { TaskWithCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../atoms/form";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import LoadingCircleSpinner from "../atoms/loading-circle-spinner";
import TaskList from "./task-list";

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
      description: string;
      categoryId?: string | null;
      dueDate?: Date | null;
    }
  >({
    mutationFn: async (newTask) => {
      setLoading(true);
      const response = await axios.post("api/tasks/new", newTask);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      form.reset();
      setLoading(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTask.mutate(values);
  }

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

            {isLoading ? (
              <LoadingCircleSpinner />
            ) : (
              <Button type="submit" size="icon" disabled={isLoading}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>

      <TaskList />
    </div>
  );
}
