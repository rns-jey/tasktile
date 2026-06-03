import NewTaskSection from "@/components/organisms/NewTaskSection";
import TaskListSection from "@/components/organisms/TaskListSection";

export default function TaskSection() {
  return (
    <div className="my-4 flex flex-col gap-4">
      {/* Add new task */}
      <NewTaskSection />

      {/* List of active and completed tasks */}
      <TaskListSection />
    </div>
  );
}
