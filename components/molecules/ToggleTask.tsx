import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { localDay, localTz } from "@/lib/date";
import { TaskWithTags } from "@/types";
import { Checkbox } from "../atoms/Checkbox";

export default function ToggleTask({ task }: { task: TaskWithTags }) {
  const queryClient = useQueryClient();

  const toggleTask = useMutation({
    mutationFn: async (task: TaskWithTags) => {
      const response = await axios.patch(`/api/tasks/${task.id}/toggle`, {
        completed: !task.completed,
        localDay: localDay(),
        tz: localTz(),
      });
      return response.data;
    },
    onMutate: async (task) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot previous value
      const previous = queryClient.getQueriesData<TaskWithTags[]>({
        queryKey: ["tasks"],
      });

      // Optimistically toggle the task from cache immediately
      queryClient.setQueriesData<TaskWithTags[]>(
        { queryKey: ["tasks"] },
        (old) =>
          old?.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? new Date() : null,
                  completedOn: !t.completed
                    ? new Date(`${localDay()}T00:00:00Z`)
                    : null,
                }
              : t,
          ),
      );

      return { previous };
    },
    onError: (err, task, context) => {
      // Roll back on error
      context?.previous.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  return (
    <Checkbox
      checked={task.completed}
      onCheckedChange={() => toggleTask.mutate(task)}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
