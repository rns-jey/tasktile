import { TaskWithCategory } from "@/types";
import EditTaskForm from "../organisms/EditTaskForm";
import ToggleTask from "./ToggleTask";

export default function OpenTaskCard({ task }: { task: TaskWithCategory }) {
  return (
    <div className="border-line flex h-16 items-center gap-3.5 border-b px-2 hover:bg-white">
      <span className="text-subtle w-[18px] font-mono text-xs">00</span>
      <ToggleTask task={task} />
      <EditTaskForm task={task} />
    </div>
  );
}
