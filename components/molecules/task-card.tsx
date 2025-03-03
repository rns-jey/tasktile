"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { Card, CardContent } from "../atoms/card";
import { Checkbox } from "../atoms/checkbox";
import { useRouter } from "next/navigation";
import { Task } from "@prisma/client";
import axios from "axios";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const router = useRouter();

  async function handleClick() {
    setIsVisible(false);

    try {
      await axios.patch(`/api/task/${task.id}`, { complete: !task.completed });

      router.refresh();
    } catch (error) {
      console.error("Failed to update task", error);
      setIsVisible(false);
    }
  }

  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Card className="w-full">
            <CardContent className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={task.completed} onCheckedChange={handleClick} />
                <label
                  htmlFor="terms"
                  className={cn(
                    task.completed && "line-through text-foreground/50",
                    " text-sm s font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  )}
                >
                  {task.name}
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
