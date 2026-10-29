import { TaskWithCategory } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const pendingDeletes = new Set<string>();
const pendingCommits = new Map<string, () => void>();

export function flushPendingDeletes() {
  pendingCommits.forEach((commit) => commit());
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return function removeTask(task: TaskWithCategory) {
    flushPendingDeletes(); // send any earlier delete first

    // Remember the task below it, in each list
    const snapshots = queryClient.getQueriesData<TaskWithCategory[]>({
      queryKey: ["tasks"],
    });
    const neighbours = snapshots
      .filter(([, list]) => list?.some((t) => t.id === task.id))
      .map(([key, list = []]) => ({
        key,
        nextId: list[list.findIndex((t) => t.id === task.id) + 1]?.id,
      }));

    pendingDeletes.add(task.id);

    // Optimistically remove the task from every list
    queryClient.setQueriesData<TaskWithCategory[]>(
      { queryKey: ["tasks"] },
      (old) => old?.filter((t) => t.id !== task.id),
    );

    let undone = false;
    let committed = false;

    const commit = async () => {
      if (undone || committed) return;

      committed = true;

      pendingCommits.delete(task.id);

      toast.dismiss(task.id);

      try {
        await axios.delete(`/api/tasks/${task.id}`);
      } catch (err) {
        console.error("delete failed", task.name, err);
        toast.error("Couldn't delete task");
      } finally {
        pendingDeletes.delete(task.id);
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["contributions"] });
      }
    };

    const undo = () => {
      undone = true;
      pendingDeletes.delete(task.id);
      pendingCommits.delete(task.id);

      neighbours.forEach(({ key, nextId }) => {
        queryClient.setQueryData<TaskWithCategory[]>(key, (old = []) => {
          const at = old.findIndex((t) => t.id === nextId);
          const next = [...old];
          next.splice(at < 0 ? next.length : at, 0, task);
          return next;
        });
      });
    };

    pendingCommits.set(task.id, commit);

    toast("Task deleted", {
      id: task.id,
      duration: 5000,
      position: "top-center",
      action: {
        label: "Undo",
        onClick: undo,
      },
      onAutoClose: commit,
      onDismiss: commit,
    });
  };
}

export const isPendingDelete = (id: string) => pendingDeletes.has(id);
