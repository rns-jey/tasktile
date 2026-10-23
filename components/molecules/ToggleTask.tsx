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
      });
      return response.data;
    },
    onMutate: async (task) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(["tasks"]);

      // Optimistically remove the task from cache immediately
      queryClient.setQueryData(["tasks"], (old: TaskWithCategory[]) =>
        old.filter((t) => t.id !== task.id),
      );

      return { previousTasks };
    },
    onError: (err, task, context) => {
      // Roll back on error
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      // await queryClient.invalidateQueries({ queryKey: ["contributions"] }); // Wait for refetch to complete
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
