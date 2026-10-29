import { cn, formatClosedDate, formatDueDate } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { AlignLeftIcon } from "lucide-react";
import { Fragment } from "react";
import { useTodayKey } from "../providers/TodayProvider";

export default function TaskMeta({ task }: { task: TaskWithCategory }) {
  const todayKey = useTodayKey();

  const due = task.dueDate ? formatDueDate(task.dueDate, todayKey) : null;
  const closed = task.completedOn
    ? formatClosedDate(task.completedOn, todayKey)
    : null;
  const isCompleted = task.completed;

  const items = [
    task.category && (
      <span className="inline-flex min-w-0 items-center gap-1.5">
        <span
          className="h-2 w-2 rounded-xs"
          style={{ backgroundColor: task.category.color }}
        />
        <span className="truncate">{task.category.name}</span>
      </span>
    ),
    due && !isCompleted && (
      <span
        className={cn(
          due.overdue
            ? "text-destructive bg-destructive/15 rounded px-1.5 font-semibold"
            : "text-meta text-muted-2",
        )}
      >
        {due.label}
      </span>
    ),
    closed && isCompleted && (
      <span className="text-meta text-muted-2">{closed}</span>
    ),
    task.description && (
      <AlignLeftIcon className="w-4" aria-label="Has description" />
    ),
  ].filter(Boolean);

  return (
    <div className="flex items-center gap-1.5">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span aria-hidden="true" className="text-muted-foreground/50">
              ·
            </span>
          )}
          {item}
        </Fragment>
      ))}
    </div>
  );
}
