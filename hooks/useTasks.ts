"use client";

import { TaskWithCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isPendingDelete } from "./useDeleteTask";

export function useTodayTasks(initialTasks?: TaskWithCategory[]) {
  return useQuery<TaskWithCategory[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("/api/tasks/today");
      return response.data;
    },
    initialData: initialTasks,
    select: (tasks) => tasks.filter((t) => !isPendingDelete(t.id)),
    staleTime: 60 * 1000,
  });
}
