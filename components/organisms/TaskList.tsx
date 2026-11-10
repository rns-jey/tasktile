"use client";

import { TaskWithCategory } from "@/types";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import TaskCard from "../molecules/TaskCard";

type TaskListProps = {
  tasks: TaskWithCategory[];
  variant?: "full" | "compact";
};

export default function TaskList({ tasks, variant = "full" }: TaskListProps) {
  const [items, setItems] = useState(tasks);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const from = prev.findIndex((t) => t.id === active.id);
      const to = prev.findIndex((t) => t.id === over.id);

      return arrayMove(prev, from, to);
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <AnimatePresence initial={false}>
          {items.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TaskCard priority={i} task={task} variant={variant} />
            </motion.div>
          ))}
        </AnimatePresence>
      </SortableContext>
    </DndContext>
  );
}
