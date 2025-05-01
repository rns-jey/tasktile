"use client";

import React, { useState } from "react";
import SlideAnimation from "../atoms/slide-animation";
import { TaskWithCategory } from "@/types";
import { Checkbox } from "../atoms/checkbox";
import { cn } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import { Clock, Trash2, Undo2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "../atoms/button";
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
} from "../atoms/alert-dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../atoms/drawer";
import EditTaskForm from "../organisms/edit-task-form";

interface TaskCardProps {
  task: TaskWithCategory;
}

function formatDueDate(dueDate: Date) {
  const difference = differenceInCalendarDays(dueDate, new Date());
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const label = {
    label: "Due " + formatter.format(difference, "day"),
    color: difference === 0 ? "text-orange-400" : difference > 0 ? "text-blue-500" : difference < 0 && "text-red-500",
  };

  return label;
}

export default function TaskCard({ task }: TaskCardProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const toggleTask = useMutation({
    mutationFn: async (task: TaskWithCategory) => {
      const response = await axios.patch(`/api/tasks/${task.id}/toggle`, { completed: !task.completed });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
      await queryClient.invalidateQueries({ queryKey: ["contributions"] }); // Wait for refetch to complete
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (task: TaskWithCategory) => {
      const response = await axios.delete(`/api/tasks/${task.id}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Wait for refetch to complete
    },
  });

  return (
    <SlideAnimation key={task.id}>
      <div className={`bg-${task.category?.color} absolute h-[100px] w-2`} />
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 w-full">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => toggleTask.mutate(task)}
            disabled={toggleTask.isPending}
            className="cursor-pointer"
          />

          <div className="flex gap-1 w-full">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger disabled={toggleTask.isPending} className="grow cursor-pointer">
                <div className="flex flex-col gap-1  ">
                  <div
                    className={cn(
                      task.completed && "line-through text-foreground/50",
                      "text-sm font-semibold text-left"
                    )}
                  >
                    {task.name}
                  </div>

                  <p
                    className={cn(
                      task.completed && "line-through text-foreground/50",
                      "text-xs text-left truncate w-60 md:w-72"
                    )}
                  >
                    {task.description}
                  </p>

                  <div
                    className={cn(
                      task.dueDate && formatDueDate(task.dueDate).color,
                      task.completed && "line-through text-foreground/50",
                      "flex gap-1 items-center text-xs"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    <span>{task.dueDate ? formatDueDate(task.dueDate).label : "No due date"}</span>
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle>Edit task</DrawerTitle>
                  <DrawerDescription>
                    Modify your task details here. Click 'Save' to update your changes.
                  </DrawerDescription>
                </DrawerHeader>
                <EditTaskForm task={task} setOpen={setOpen} />
              </DrawerContent>
            </Drawer>
            {task.completed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleTask.mutate(task)}
                disabled={toggleTask.isPending}
                className="h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deleteTask.isPending}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the task and remove it from your task
                    list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteTask.mutate(task)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </SlideAnimation>
  );
}

// interface TaskCardProps {
//   task: TaskWithCategory;
//   tasks: TaskWithCategory[];
//   setTasks: React.Dispatch<React.SetStateAction<TaskWithCategory[]>>;
//   categories: Category[];
//   setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
// }

// function formatDueDate(dueDate: Date) {
//   const difference = differenceInCalendarDays(dueDate, new Date());
//   const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
//   const label = {
//     label: "Due " + formatter.format(difference, "day"),
//     color: difference === 0 ? "text-orange-400" : difference > 0 ? "text-blue-500" : difference < 0 && "text-red-500",
//   };

//   return label;
// }

// export default function TaskCard({ task, tasks, setTasks, categories, setCategories }: TaskCardProps) {
//   const [isLoading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   async function deleteTask(id: string) {
//     try {
//       setLoading(true);
//       await axios.delete(`/api/task/${task.id}`);

//       setTasks(tasks.filter((task) => task.id !== id));
//       setLoading(false);
//       toast("Task deleted.");
//     } catch (error) {
//       console.error("Failed to delete task", error);
//       setLoading(false);
//     }
//   }

//   async function handleClick(id: string) {
//     try {
//       setLoading(true);
//       await axios.patch(`/api/task/${task.id}/toggle`, { completed: !task.completed });

//       setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));

//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to update task", error);
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <div className={`bg-${task.category?.color} absolute h-[100px] w-2`} />

//       <div className="flex items-center justify-between p-3">
//         <div className="flex items-center gap-3 w-full">
//           <Checkbox
//             id={`task-${task.id}`}
//             checked={task.completed}
//             onCheckedChange={() => handleClick(task.id)}
//             disabled={isLoading}
//             className="cursor-pointer"
//           />

//           <Drawer open={open} onOpenChange={setOpen}>
//             <DrawerTrigger disabled={task.completed} className="w-full cursor-pointer">
//               <div className="flex flex-col gap-1">
//                 <div
//                   className={cn(task.completed && "line-through text-foreground/50", "text-sm font-semibold text-left")}
//                 >
//                   {task.name}
//                 </div>
//                 <p
//                   className={cn(
//                     task.completed && "line-through text-foreground/50",
//                     "text-xs text-left truncate w-60 md:w-72"
//                   )}
//                 >
//                   {task.description}
//                 </p>
//                 <div
//                   className={cn(
//                     task.dueDate && formatDueDate(task.dueDate).color,
//                     task.completed && "line-through text-foreground/50",
//                     "flex gap-1 items-center text-xs"
//                   )}
//                 >
//                   <Clock className="h-3 w-3" />
//                   <span>{task.dueDate ? formatDueDate(task.dueDate).label : "No due date"}</span>
//                 </div>
//               </div>
//             </DrawerTrigger>
//             <DrawerContent>
//               <DrawerHeader className="text-left">
//                 <DrawerTitle>Edit task</DrawerTitle>
//                 <DrawerDescription>
//                   Modify your task details here. Click 'Save' to update your changes.
//                 </DrawerDescription>
//               </DrawerHeader>
//               <EditTaskForm
//                 task={task}
//                 tasks={tasks}
//                 setTasks={setTasks}
//                 setOpen={setOpen}
//                 categories={categories}
//                 setCategories={setCategories}
//               />
//             </DrawerContent>
//           </Drawer>
//         </div>

//         <div className="flex gap-1">
//           {task.completed && (
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => handleClick(task.id)}
//               disabled={isLoading}
//               className="h-8 w-8 text-muted-foreground hover:text-primary"
//             >
//               <Undo2 className="h-4 w-4" />
//             </Button>
//           )}

//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 disabled={isLoading}
//                 className="h-8 w-8 text-muted-foreground hover:text-destructive"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This action cannot be undone. This will permanently delete the task and remove it from your task list.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction onClick={() => deleteTask(task.id)}>Continue</AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       </div>
//     </>
//   );
// }
