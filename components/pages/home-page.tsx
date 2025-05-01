import Header from "../organisms/header";

import currentProfile from "@/lib/current-profile";
import TaskSection from "../organisms/task-section";
import MonthTiles from "../organisms/MonthTiles";

export default async function HomePage() {
  const currentUser = await currentProfile();

  return (
    <div className="flex flex-col gap-4 items-center">
      <Header />

      <main className="p-4 flex flex-row gap-4">
        <TaskSection />

        <div>
          <MonthTiles />
        </div>
      </main>
    </div>
  );
}
