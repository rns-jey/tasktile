import { TaskWithCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { ScrollArea } from "../atoms/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import SlideAnimation from "../atoms/slide-animation";
import { Checkbox } from "../atoms/checkbox";
import { differenceInCalendarDays } from "date-fns";
import { Clock } from "lucide-react";

function formatDueDate(dueDate: Date) {
  const difference = differenceInCalendarDays(dueDate, new Date());
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const label = {
    label: "Due " + formatter.format(difference, "day"),
    color: difference === 0 ? "text-orange-400" : difference > 0 ? "text-blue-500" : difference < 0 && "text-red-500",
  };

  return label;
}

export default function TaskList() {
  const { data: tasks } = useQuery<TaskWithCategory[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("/api/tasks");

      return response.data;
    },
  });

  if (!tasks) return <div>Loading...</div>;

  const activeTasks = tasks.filter((task) => !task.completed);

  return (
    <>
      {/* Active tasks */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-primary">Active Tasks</h2>

        {activeTasks.length > 0 && (
          <ScrollArea className={cn(activeTasks.length >= 5 ? "h-[300px]" : "h-fit")}>
            <AnimatePresence>
              <div className="space-y-1">
                {activeTasks.map((task) => (
                  <SlideAnimation key={task.id}>
                    <div className={`bg-${task.category?.color} absolute h-[100px] w-2`} />
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 w-full">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => {}}
                          // disabled={isLoading}
                          className="cursor-pointer"
                        />

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
                      </div>
                    </div>
                  </SlideAnimation>
                ))}
              </div>
            </AnimatePresence>
          </ScrollArea>
        )}
      </div>

      {activeTasks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">
          No active tasks. Add a new task to get started!
        </p>
      )}
    </>
  );
}

// "use client";

// import { useState } from "react";
// import { Category, Task } from "@prisma/client";

// import { AnimatePresence, motion } from "motion/react";
// import NewTaskForm from "./new-task-form";
// import { ScrollArea } from "../atoms/scroll-area";
// import TaskCard from "../molecules/task-card";
// import { cn } from "@/lib/utils";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../atoms/accordion";
// import { TaskWithCategory } from "@/types";
// import SlideAnimation from "../atoms/slide-animation";

// interface TaskListProps {
//   taskList: TaskWithCategory[];
//   categoryList: Category[];
// }

// export default function TaskList({ taskList, categoryList }: TaskListProps) {
//   const [tasks, setTasks] = useState<TaskWithCategory[]>(taskList);
//   const [categories, setCategories] = useState<Category[]>(categoryList);

//   const activeTasks = tasks.filter((task) => !task.completed);
//   const completedTasks = tasks.filter((task) => task.completed);

//   return (
//     <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>

//       {/* Add new task */}
//       <NewTaskForm tasks={tasks} setTasks={setTasks} categories={categories} setCategories={setCategories} />

//       {/* Active tasks */}
//       <div>
//         <h2 className="text-lg font-semibold mb-3 text-primary">Active Tasks</h2>
//         {activeTasks.length > 0 && (
//           <ScrollArea className={cn(activeTasks.length >= 5 ? "h-[300px]" : "h-fit")}>
//             <AnimatePresence>
//               <div className="space-y-1">
//                 {activeTasks.map((task) => (
//                   <SlideAnimation key={task.id}>
//                     <TaskCard
//                       task={task}
//                       tasks={tasks}
//                       setTasks={setTasks}
//                       categories={categories}
//                       setCategories={setCategories}
//                     />
//                   </SlideAnimation>
//                 ))}
//               </div>
//             </AnimatePresence>
//           </ScrollArea>
//         )}
//         {activeTasks.length === 0 && (
//           <p className="text-sm text-muted-foreground text-center py-3">
//             No active tasks. Add a new task to get started!
//           </p>
//         )}
//       </div>

//       {/* Completed tasks */}
//       <Accordion type="single" collapsible>
//         <AccordionItem value="completed-tasks">
//           <AccordionTrigger>
//             <h2 className="text-lg font-semibold text-primary">Completed Tasks</h2>
//           </AccordionTrigger>
//           <AccordionContent>
//             <ScrollArea className={cn(completedTasks.length >= 5 ? "h-[300px]" : "h-fit")}>
//               <AnimatePresence>
//                 <div className="space-y-1">
//                   {completedTasks.map((task) => (
//                     <SlideAnimation key={task.id}>
//                       <TaskCard
//                         task={task}
//                         tasks={tasks}
//                         setTasks={setTasks}
//                         categories={categories}
//                         setCategories={setCategories}
//                       />
//                     </SlideAnimation>
//                   ))}
//                 </div>
//               </AnimatePresence>
//             </ScrollArea>
//             {completedTasks.length === 0 && (
//               <p className="text-sm text-muted-foreground text-center py-3">No completed tasks yet.</p>
//             )}
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   );
// }
