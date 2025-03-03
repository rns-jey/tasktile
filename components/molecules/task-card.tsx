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
      await axios.patch(`/api/task/${task.id}`, { complete: !task.complete });
    } catch (error) {
      console.error("Failed to update task", error);
      setIsVisible(false);
    }
  }

  return (
    <AnimatePresence initial={false}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, x: 100 }} // Slightly offset at the start
          animate={{ opacity: 1, x: 0 }} // Move to its position
          exit={{ opacity: 0, x: 100 }} // Slide out while fading
          className="w-full"
        >
          <Card className="w-full">
            <CardContent className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={task.complete} onCheckedChange={handleClick} />
                <label
                  htmlFor="terms"
                  className={cn(
                    task.complete && "line-through text-foreground/50",
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
