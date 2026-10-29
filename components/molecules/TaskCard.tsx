import { cva, type VariantProps } from "class-variance-authority";

import { TaskWithCategory } from "@/types";

import EditTaskDrawer from "../organisms/EditTaskDrawer";
import ToggleTask from "./ToggleTask";

const taskCardVariants = cva("flex items-center gap-3.5 hover:bg-white px-2", {
  variants: {
    variant: {
      full: "border-line h-16 border-b  ",
      compact: "h-14 mx-5 justify-between",
    },
  },
  defaultVariants: { variant: "full" },
});

type TaskCardProps = { task: TaskWithCategory } & VariantProps<
  typeof taskCardVariants
>;

export default function TaskCard({ task, variant }: TaskCardProps) {
  return (
    <div className={taskCardVariants({ variant })}>
      {!task.completed && (
        <span className="text-subtle w-4.5 font-mono text-xs">00</span>
      )}
      <ToggleTask task={task} />
      <EditTaskDrawer task={task} variant={variant ?? "full"} />
    </div>
  );
}
