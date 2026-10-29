"use client";

import { TaskWithCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isPendingDelete } from "./useDeleteTask";

export function useTodayTasks(initialTasks?: TaskWithCategory[]) {
  return useQuery<TaskWithCategory[]>({
    queryKey: ["tasks", "today"],
    queryFn: async () => {
      const response = await axios.get("/api/tasks/today");
      return response.data;
    },
    initialData: initialTasks,
    select: (tasks) => tasks.filter((t) => !isPendingDelete(t.id)),
    staleTime: 60 * 1000,
  });
}

export function useTasks(initialTasks?: TaskWithCategory[]) {
  return useQuery<TaskWithCategory[]>({
    queryKey: ["tasks", "all"],
    queryFn: async () => {
      const response = await axios.get("/api/tasks");
      return response.data;
    },
    initialData: initialTasks,
    select: (tasks) => tasks.filter((t) => !isPendingDelete(t.id)),
    staleTime: 60 * 1000,
  });
}
