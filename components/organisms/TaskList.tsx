"use client";

import { TaskWithCategory } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import TaskCard from "../molecules/TaskCard";

type TaskListProps = {
  tasks: TaskWithCategory[];
  variant?: "full" | "compact";
};

export default function TaskList({ tasks, variant = "full" }: TaskListProps) {
  return (
    <AnimatePresence initial={false}>
      {tasks.map((task, i) => (
        <motion.div
          key={task.id}
          layout
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TaskCard priority={i} task={task} variant={variant} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
