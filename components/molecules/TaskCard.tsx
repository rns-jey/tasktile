"use client";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import TaskMeta from "./TaskMeta";

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
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      {...attributes}
      {...listeners}
      onClick={() => {}}
      aria-labelledby={`task-${task.id}`}
      className={cn(
        "border-line flex min-h-16 touch-manipulation items-center justify-between gap-2 border-b py-2 select-none",
        isDragging && "bg-background relative z-10 shadow-lg",
      )}
    >
      <Checkbox />

      <div className="w-full min-w-0">
        <p className="truncate font-medium">{task.name}</p>
        {task.description && (
          <p className="text-ink/90 truncate text-sm">{task.description}</p>
        )}
        <TaskMeta task={task} />
      </div>

      <Button type="button" variant="secondary">
        <GripVertical />
      </Button>
    </article>
  );
}

// export default function TaskCard({ priority, task, variant }: TaskCardProps) {
//   const { setNodeRef, listeners, attributes, transform, isDragging } =
//     useDraggable({
//       id: task.id,
//     });

//   const style = transform
//     ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
//     : undefined;

//   return (
//     <article className={taskCardVariants({ variant })} ref={setNodeRef}>
//       {!task.completed && (
//         <span className="text-subtle w-4.5 font-mono text-xs">
//           {String(priority + 1).padStart(2, "0")}
//         </span>
//       )}
//       <ToggleTask task={task} />
//       <EditTaskDrawer task={task} variant={variant ?? "full"} />
//     </article>
//   );
// }
