"use client";

import TaskList from "./task-list";
import NewTaskForm from "./new-task-form";

export default function TaskSection() {
  return (
    <div className="bg-background mx-auto w-full rounded-lg p-6 shadow-lg">
      <h2 className="text-primary mb-3 text-lg font-semibold">Tasks</h2>

      {/* Add new task */}
      <NewTaskForm />

      {/* List of active and completed tasks */}
      <TaskList />
    </div>
  );
}
