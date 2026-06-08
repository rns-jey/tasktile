import { cn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { differenceInCalendarDays } from "date-fns";
import { Clock } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "motion/react";
import { useState } from "react";
import FormEditTask from "../organisms/FormEditTask";
import { Checkbox } from "../ui/Checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/Drawer";

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
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const toggleTask = useMutation({
    mutationFn: async (task: TaskWithCategory) => {
      const response = await axios.patch(`/api/tasks/${task.id}/toggle`, {
        completed: !task.completed,
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      // await queryClient.invalidateQueries({ queryKey: ["contributions"] }); // Wait for refetch to complete
    },
  });

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 0, scale: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-y-hidden rounded-md border">
        <div className={`bg-${task.category?.color} absolute h-[100px] w-2`} />

        <div className="flex items-center px-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask.mutate(task)}
            disabled={toggleTask.isPending}
            className="cursor-pointer"
          />

          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <div className="w-full cursor-pointer p-2">
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
                    {task.dueDate
                      ? formatDueDate(task.dueDate).label
                      : "No due date"}
                  </span>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit Task</DrawerTitle>
                <DrawerDescription hidden />
              </DrawerHeader>
              <FormEditTask task={task} setOpen={setOpen} />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </motion.div>
  );
}
