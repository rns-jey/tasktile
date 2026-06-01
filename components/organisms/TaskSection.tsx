import TaskList from "./task-list";
import NewTaskForm from "./NewTaskForm";
import { Plus } from "lucide-react";
import { Button } from "../atoms/Button";
import NewTaskSection from "./NewTaskSection";

export default function TaskSection() {
  return (
    <div className="my-4">
      {/* Add new task */}
      <NewTaskSection />

      {/* List of active and completed tasks */}
      {/* <TaskList /> */}
    </div>
  );
}
