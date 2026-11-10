"use client";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import TaskMeta from "./TaskMeta";
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

export default function TaskCard({ task }: TaskCardProps) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id: task.id, disabled: task.completed });

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
        "border-line flex min-h-16 cursor-pointer touch-manipulation items-center justify-between gap-2 border-b px-2 py-2 select-none",
        isDragging &&
          "bg-background shadow-jade relative z-10 cursor-grabbing rounded-xl shadow-lg",
      )}
    >
      <ToggleTask task={task} />

      <div className="peer-data-checked:text-muted-foreground w-full min-w-0 peer-data-checked:line-through">
        <p className="truncate font-medium">{task.name}</p>
        {task.description && (
          <p className="text-ink/90 truncate text-sm">{task.description}</p>
        )}
        <TaskMeta task={task} />
      </div>
    </article>
  );
}
