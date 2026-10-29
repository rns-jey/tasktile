import { redirect } from "next/navigation";

import currentProfile from "@/lib/profile";
import { getTodayTasks } from "@/lib/queries/task";
import { getToday } from "@/lib/today";

import UnfinishedBanner from "@/components/molecules/UnfinishedBanner";
import TodayHeader from "@/components/organisms/TodayHeader";
import TodayTaskSection from "@/components/organisms/TodayTaskSection";
import { ScrollArea } from "@/components/ui/ScrollArea";

export default async function Home() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tasks = await getTodayTasks(currentUser.userID, await getToday());

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 p-4">
        <TodayHeader initialTasks={tasks} />

        <UnfinishedBanner />

        <TodayTaskSection initialTasks={tasks} />
      </ScrollArea>
    </main>
  );
}
