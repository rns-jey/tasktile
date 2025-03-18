"use client";

import TaskList from "./task-list";
import NewTaskForm from "./new-task-form";
import { useQuery } from "@tanstack/react-query";
import { TaskWithCategory } from "@/types";
import axios from "axios";

export default function TaskSection() {
  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
      {/* Add new task */}
      <NewTaskForm />

      {/* List of active and completed tasks */}
      <TaskList />
    </div>
  );
}
