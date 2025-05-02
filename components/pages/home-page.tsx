import Header from "../organisms/header";

import currentProfile from "@/lib/current-profile";
import TaskSection from "../organisms/task-section";
import MonthTiles from "../organisms/MonthTiles";
import CompletedToday from "../organisms/CompletedToday";

export default async function HomePage() {
  const currentUser = await currentProfile();

  return (
    <div className="flex flex-col items-center gap-4">
      <Header />

      <main className="flex flex-row gap-4 p-4">
        <TaskSection />

        <div className="flex gap-2">
          <div>
            <MonthTiles />
          </div>

          <div>
            <CompletedToday />
          </div>
        </div>
      </main>
    </div>
  );
}
