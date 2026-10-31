import { redirect } from "next/navigation";

import currentProfile from "@/lib/profile";
import { getTodayTasks } from "@/lib/queries/task";
import { getToday } from "@/lib/today";

import TodayHeader from "@/components/organisms/TodayHeader";
import TodayTaskSection from "@/components/organisms/TodayTaskSection";
import { Fragment } from "react";

export default async function Home() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tasks = await getTodayTasks(currentUser.userID, await getToday());

  return (
    <Fragment>
      <TodayHeader initialTasks={tasks} />

      {/* <UnfinishedBanner /> */}

      <TodayTaskSection initialTasks={tasks} />
    </Fragment>
  );
}
