import { cn, formatClosedDate, formatDueOn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { Calendar, Layers, Tag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTodayKey } from "../providers/TodayProvider";

export default function TaskMeta({ task }: { task: TaskWithCategory }) {
  const todayKey = useTodayKey();

  const pathname = usePathname();

  let dateText: string | null = null;
  let overdue = false;

  if (task.completed && task.completedOn) {
    dateText = formatClosedDate(task.completedOn, todayKey);
  } else if (!task.completed && task.dueOn) {
    const due = formatDueOn(task.dueOn, todayKey);
    dateText = due.label;
    overdue = due.overdue;
  }

  return (
    <div className="relative text-xs">
      <div className="flex flex-col gap-0.5">
        {dateText && (
          <span
            className={cn(
              overdue ? "text-destructive" : "text-ink/90",
              "inline-flex items-center gap-1",
            )}
          >
            <Calendar className="size-3" /> {dateText}
          </span>
        )}

        {task.category && (
          <span
            className="inline-flex items-center gap-1"
            style={{ color: task.category.color }}
          >
            <Tag className="size-3" /> {task.category.name}
          </span>
        )}
      </div>

      {pathname === "/" && (
        <span className="absolute right-0 bottom-0 inline-flex items-center gap-1">
          <Layers className="size-3" /> {task.stack ? task.stack.name : "Inbox"}
        </span>
      )}
    </div>
  );
}
