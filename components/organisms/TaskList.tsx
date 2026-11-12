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
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import TaskCard from "../molecules/TaskCard";

type TaskListProps = {
  tasks: TaskWithCategory[];
  variant?: "full" | "compact";
};

export default function TaskList({ tasks, variant = "full" }: TaskListProps) {
  const [order, setOrder] = useState(() => tasks.map((t) => t.id));
  const [animateLayout, setAnimateLayout] = useState(true);

  const count = tasks.length;
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      document
        .getElementById("open-end")
        ?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    prevCount.current = count;
  }, [count]);

  const dndId = useId();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  const items = useMemo(() => {
    const byId = new Map(tasks.map((t) => [t.id, t]));
    const sorted = order
      .filter((id) => byId.has(id))
      .map((id) => byId.get(id)!);
    const added = tasks
      .filter((t) => !order.includes(t.id))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const all = [...sorted, ...added];

    const open = all.filter((t) => !t.completed);
    const closed = all
      .filter((t) => t.completed)
      .sort(
        (a, b) =>
          new Date(b.completedAt!).getTime() -
          new Date(a.completedAt!).getTime(),
      );

    return [...open, ...closed];
  }, [tasks, order]);

  const lastOpenIndex = items.findLastIndex((t) => !t.completed);

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    const from = items.findIndex((t) => t.id === active.id);
    const to = items.findIndex((t) => t.id === over.id);
    const next = arrayMove(items, from, to);

    setOrder(next.map((t) => t.id));
    requestAnimationFrame(() => setAnimateLayout(true));
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      onDragStart={() => setAnimateLayout(false)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setAnimateLayout(true)}
    >
      <SortableContext
        items={items.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <AnimatePresence initial={false}>
          {lastOpenIndex === -1 && (
            <div id="open-end" className="scroll-mb-34" />
          )}

          {items.map((task, i) => (
            <Fragment key={task.id}>
              <motion.div
                layout={animateLayout}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskCard priority={i} task={task} variant={variant} />
              </motion.div>
              {i === lastOpenIndex && (
                <div id="open-end" className="scroll-mb-34" />
              )}
            </Fragment>
          ))}
        </AnimatePresence>
      </SortableContext>
    </DndContext>
  );
}
