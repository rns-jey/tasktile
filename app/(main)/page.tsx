import UnfinishedBanner from "@/components/molecules/UnfinishedBanner";
import AppHeader from "@/components/organisms/AppHeader";
import AppSidebar from "@/components/organisms/AppSidebar";
import MobileNav from "@/components/organisms/MobileNav";
import TaskListSection from "@/components/organisms/TaskListSection";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { SidebarInset } from "@/components/ui/Sidebar";
import currentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function Home() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tasks = await db.task.findMany({
    where: { userId: currentUser.userID },
    include: { category: true },
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <Fragment>
      <AppSidebar profile={currentUser} />
      <SidebarInset className="flex h-dvh w-full flex-col overflow-hidden">
        <main className="flex min-h-0 flex-1 flex-col">
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
