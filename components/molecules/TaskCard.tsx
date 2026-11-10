import { cva, type VariantProps } from "class-variance-authority";

import { TaskWithCategory } from "@/types";

import { useDraggable } from "@dnd-kit/core";
import EditTaskDrawer from "../organisms/EditTaskDrawer";
import ToggleTask from "./ToggleTask";

const taskCardVariants = cva("flex items-center gap-3.5 hover:bg-white px-2", {
  variants: {
    variant: {
      full: "border-line h-16 border-b",
      compact: "h-14 mx-5 justify-between",
    },
  },
  defaultVariants: { variant: "full" },
});

type TaskCardProps = {
  priority: number;
  task: TaskWithCategory;
} & VariantProps<typeof taskCardVariants>;

export default function TaskCard({ priority, task, variant }: TaskCardProps) {
  const { setNodeRef, listeners, attributes, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <article className={taskCardVariants({ variant })} ref={setNodeRef}>
      {!task.completed && (
        <span className="text-subtle w-4.5 font-mono text-xs">
          {String(priority + 1).padStart(2, "0")}
        </span>
      )}
      <ToggleTask task={task} />
      <EditTaskDrawer task={task} variant={variant ?? "full"} />
    </article>
  );
}
