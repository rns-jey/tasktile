import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Fragment } from "react";

import currentProfile from "@/lib/current-profile";
import { dayInTz } from "@/lib/date";
import { db } from "@/lib/db";

import UnfinishedBanner from "@/components/molecules/UnfinishedBanner";
import AppHeader from "@/components/organisms/AppHeader";
import AppSidebar from "@/components/organisms/AppSidebar";
import MobileNav from "@/components/organisms/MobileNav";
import TaskListSection from "@/components/organisms/TaskListSection";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { SidebarInset } from "@/components/ui/Sidebar";

export default async function Home() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tz = (await cookies()).get("tz")?.value ?? "UTC";
  const day = dayInTz(tz);
  const today = new Date(`${day}T00:00:00Z`);

  const tasks = await db.task.findMany({
    where: {
      userId: currentUser.userID,
      OR: [
        // everything scheduled today (done or not)
        { scheduledOn: today },
        // unfinished leftovers whose deadline is still ahead
        {
          completed: false,
          scheduledOn: { lt: today },
        },
        { completedOn: today },
      ],
    },
    include: { category: true },
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <Fragment>
      <AppSidebar profile={currentUser} />

      <SidebarInset className="flex h-dvh w-full flex-col overflow-hidden">
        <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
          <ScrollArea className="min-h-0 flex-1 p-4">
            <AppHeader initialTasks={tasks} />

            <UnfinishedBanner />

            <TaskListSection initialTasks={tasks} />
          </ScrollArea>
        </main>

        <MobileNav />
      </SidebarInset>
    </Fragment>
  );
}
