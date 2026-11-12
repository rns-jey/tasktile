import { cn, formatClosedDate, formatDueOn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { Calendar, Tag } from "lucide-react";
import { Fragment } from "react";
import { useTodayKey } from "../providers/TodayProvider";

export default function TaskMeta({ task }: { task: TaskWithCategory }) {
  const todayKey = useTodayKey();

  const due = task.dueOn ? formatDueOn(task.dueOn, todayKey) : null;
  const closed = task.completedOn
    ? formatClosedDate(task.completedOn, todayKey)
    : null;
  const isCompleted = task.completed;

  // const items = [
  //   task.category && (

  //     <span className="inline-flex min-w-0 items-center gap-1.5">
  //       <span
  //         className="h-2 w-2 rounded-xs"
  //         style={{ backgroundColor: task.category.color }}
  //       />
  //       <span className="truncate">{task.category.name}</span>
  //     </span>
  //   ),
  //   due && !isCompleted && (
  //     <span
  //       className={cn(
  //         due.overdue
  //           ? "text-destructive bg-destructive/15 rounded px-1.5 font-semibold"
  //           : "text-meta",
  //       )}
  //     >
  //       {due.label}
  //     </span>
  //   ),
  //   closed && isCompleted && <span className="text-meta">{closed}</span>,
  //   task.description && (
  //     <AlignLeftIcon className="w-4" aria-label="Has description" />
  //   ),
  // ].filter(Boolean);

  const items = [
    task.category && (
      <span
        className="inline-flex items-center gap-1"
        style={{ color: task.category.color }}
      >
        <Tag className="size-3" /> {task.category?.name}
      </span>
    ),
    due && (
      <span
        className={cn(
          due.overdue ? "text-destructive" : "text-ink/90",
          "inline-flex items-center gap-1",
        )}
      >
        <Calendar className="size-3" /> {due.label}
      </span>
    ),
  ].filter(Boolean);

  return (
    <p className="text-sm">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span
              aria-hidden="true"
              className="text-muted-foreground/50 mx-1.5"
            >
              ·
            </span>
          )}
          {item}
        </Fragment>
      ))}
    </p>
  );
}
