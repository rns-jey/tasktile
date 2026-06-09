import { cn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import { differenceInCalendarDays } from "date-fns";
import { Clock, Trash } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "motion/react";
import { useState } from "react";
import FormEditTask from "../organisms/FormEditTask";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/AlertDialog";
import { Button } from "../ui/Button";
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
    onMutate: async (task) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(["tasks"]);

      // Optimistically remove the task from cache immediately
      queryClient.setQueryData(["tasks"], (old: TaskWithCategory[]) =>
        old.filter((t) => t.id !== task.id),
      );

      return { previousTasks };
    },
    onError: (err, task, context) => {
      // Roll back on error
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      // await queryClient.invalidateQueries({ queryKey: ["contributions"] }); // Wait for refetch to complete
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (task: TaskWithCategory) => {
      const response = await axios.delete(`/api/tasks/${task.id}`);
      return response.data;
    },
    onMutate: async (task) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(["tasks"]);

      // Optimistically remove the task from cache immediately
      queryClient.setQueryData(["tasks"], (old: TaskWithCategory[]) =>
        old.filter((t) => t.id !== task.id),
      );

      return { previousTasks };
    },
    onError: (err, task, context) => {
      // Roll back on error
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSuccess: () => {
      // Invalidate in background — no awaiting, so no UI jump
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["contributions"] });
    },
  });

  const isLoading = toggleTask.isPending || deleteTask.isPending;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-y-hidden rounded-md border">
        <div className={`bg-${task.category?.color} absolute h-[100px] w-2`} />

        <div
          className={cn(
            "flex items-center px-4",
            isLoading && "pointer-events-none",
          )}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask.mutate(task)}
            className="cursor-pointer"
          />

          <div className="group flex w-full items-center">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <div className="w-full cursor-pointer p-2">
                  <h3 className="font-semibold">{task.name}</h3>

                  {task.description && (
                    <p className={cn("text-muted-foreground")}>
                      {task.description}
                    </p>
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="pointer-events-none translate-x-1.5 items-center text-red-500 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 hover:text-red-500"
                >
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the task and remove it from your task list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteTask.mutate(task)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
