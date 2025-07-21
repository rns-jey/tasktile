import Header from "../organisms/header";

import currentProfile from "@/lib/current-profile";
import TaskSection from "../organisms/task-section";
import MonthTiles from "../organisms/MonthTiles";
import CompletedToday from "../organisms/CompletedToday";
import DashboardSection from "../organisms/DashboardSection";

export default async function HomePage() {
  const currentUser = await currentProfile();

  return (
    <div className="flex flex-col items-center gap-4">
      <Header />

      <main className="flex flex-row gap-4 p-4">
        <DashboardSection />
        <TaskSection />
      </main>
    </div>
  );
}
