import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { StackWithTaskCount } from "@/lib/models/stacks/types";
import { TaskWithTags } from "@/types";
import { isPendingDelete } from "./useDeleteTask";

export function useStacks() {
  return useQuery<StackWithTaskCount[]>({
    queryKey: ["stacks", "list"],
    queryFn: async () => {
      const response = await axios.get("/api/stacks");
      return response.data;
    },
    // select: (stacks) => stacks.filter((t) => !isPendingDelete(t.id)),
    staleTime: 60 * 1000,
  });
}

export function useStackTasks(stackId: string) {
  return useQuery<TaskWithTags[]>({
    queryKey: ["tasks", stackId],
    queryFn: async () => {
      const response = await axios.get(`/api/stacks/${stackId}/tasks`);
      return response.data;
    },
    select: (tasks) => tasks.filter((t) => !isPendingDelete(t.id)),
    staleTime: 60 * 1000,
  });
}
