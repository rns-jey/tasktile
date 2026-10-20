import UnfinishedBanner from "../molecules/UnfinishedBanner";
import TaskListSection from "./TaskListSection";

export default function MainSection() {
  return (
    <main className="py-4">
      <UnfinishedBanner />

      <TaskListSection />
    </main>
  );
}
