import currentProfile from "@/lib/current-profile";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import UnfinishedBanner from "../molecules/UnfinishedBanner";
import AppHeader from "../organisms/AppHeader";
import MobileNav from "../organisms/MobileNav";
import TaskListSection from "../organisms/TaskListSection";

export default async function HomePage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tasks = await db.task.findMany({
    where: { userId: currentUser.userID },
    include: { category: true },
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    // <div className="flex flex-col items-center gap-4">
    //
    //   <Main />
    // </div>
    <div className="h-full px-6">
      <AppHeader initialTasks={tasks} />

      <main className="py-4">
        <UnfinishedBanner />

        <TaskListSection initialTasks={tasks} />
      </main>

      <MobileNav />
    </div>
  );
}
