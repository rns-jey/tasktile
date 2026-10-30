import { Category } from "@/lib/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const pendingDeletes = new Set<string>();
const pendingCommits = new Map<string, () => void>();

export function flushPendingDeletes() {
  pendingCommits.forEach((commit) => commit());
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return function removeCategory(category: Category) {
    flushPendingDeletes(); // send any earlier delete first

    // Remember the category below it, in each list
    const snapshots = queryClient.getQueriesData<Category[]>({
      queryKey: ["categories"],
    });

    const neighbours = snapshots
      .filter(([, list]) => list?.some((c) => c.id === category.id))
      .map(([key, list = []]) => ({
        key,
        nextId: list[list.findIndex((c) => c.id === category.id) + 1]?.id,
      }));

    pendingDeletes.add(category.id);

    // Optimistically remove the category from every list
    queryClient.setQueriesData<Category[]>(
      { queryKey: ["categories"] },
      (old) => old?.filter((c) => c.id !== category.id),
    );

    let undone = false;
    let committed = false;

    const commit = async () => {
      if (undone || committed) return;

      committed = true;

      pendingCommits.delete(category.id);

      toast.dismiss(category.id);

      try {
        await axios.delete(`/api/categories/${category.id}`);
      } catch (err) {
        console.error("delete failed", category.name, err);
        toast.error("Couldn't delete category");
      } finally {
        pendingDeletes.delete(category.id);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
    };

    const undo = () => {
      undone = true;
      pendingDeletes.delete(category.id);
      pendingCommits.delete(category.id);

      neighbours.forEach(({ key, nextId }) => {
        queryClient.setQueryData<Category[]>(key, (old = []) => {
          const at = old.findIndex((c) => c.id === nextId);
          const next = [...old];
          next.splice(at < 0 ? next.length : at, 0, category);
          return next;
        });
      });
    };

    pendingCommits.set(category.id, commit);

    toast("Category deleted", {
      id: category.id,
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
