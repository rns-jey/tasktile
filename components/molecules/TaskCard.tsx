import { cn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { differenceInCalendarDays } from "date-fns";
import { Clock } from "lucide-react";

import React from "react";

interface TaskCardProps {
  task: TaskWithCategory;
}

function formatDueDate(dueDate: Date) {
  const difference = differenceInCalendarDays(dueDate, new Date());
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const label = {
    label: "Due " + formatter.format(difference, "day"),
    color:
      difference === 0
        ? "text-orange-400"
        : difference > 0
          ? "text-blue-500"
          : difference < 0 && "text-red-500",
  };

  return label;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="relative overflow-y-hidden rounded-md border">
      <div className={`bg-${task.category?.color} absolute h-[100px] w-2`} />

      <div className="p-4">
        <h3 className="font-semibold">{task.name}</h3>

        {task.description && (
          <p className="text-muted-foreground">{task.description}</p>
        )}

        <div
          className={cn(
            task.dueDate && formatDueDate(task.dueDate).color,
            task.completed && "text-foreground/50 line-through",
            "flex items-center gap-1 text-xs",
          )}
        >
          <Clock className="h-3 w-3" />
          <span>
            {task.dueDate ? formatDueDate(task.dueDate).label : "No due date"}
          </span>
        </div>
      </div>
    </div>
  );
}
