import { localDay, localTz } from "@/lib/date";
import { TaskWithCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Checkbox } from "../ui/Checkbox";

export default function ToggleTask({ task }: { task: TaskWithCategory }) {
  const queryClient = useQueryClient();

  const toggleTask = useMutation({
    mutationFn: async (task: TaskWithCategory) => {
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
      const previousTasks = queryClient.getQueryData<TaskWithCategory[]>([
        "tasks",
      ]);

      // Optimistically remove the task from cache immediately
      queryClient.setQueryData<TaskWithCategory[]>(["tasks"], (old) =>
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

      return { previousTasks };
    },
    onError: (err, task, context) => {
      // Roll back on error
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
    },
  });

  return (
    <Checkbox
      checked={task.completed}
      onCheckedChange={() => toggleTask.mutate(task)}
      className="rounded-check ring-stroke size-6 cursor-pointer ring-[1.75px] ring-inset"
    />
  );
}
