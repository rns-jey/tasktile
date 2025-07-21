import Header from "../organisms/header";

import currentProfile from "@/lib/current-profile";
import TaskSection from "../organisms/TaskSection";
import MonthTiles from "../organisms/MonthTiles";
import CompletedToday from "../organisms/CompletedToday";
import DashboardSection from "../organisms/DashboardSection";
import Main from "../organisms/Main";

export default async function HomePage() {
  const currentUser = await currentProfile();

  return (
    <div className="flex flex-col items-center gap-4">
      <Header />
      <Main />
    </div>
  );
}
