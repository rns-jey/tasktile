import CalendarSection from "@/components/organisms/CalendarSection";
import currentProfile from "@/lib/profile";
import { getTaskCount } from "@/lib/queries/task";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function Analytics() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const stats = await getTaskCount(currentUser.userID);

  console.log("Task count : ", stats);

  return (
    <Fragment>
      <header className="flex gap-5 pb-4">
        <h1 className="flex flex-col">
          <p className="font-display text-display-lg">6</p>
          <p className="text-body text-muted flex gap-1">day streak</p>
        </h1>

        <h1 className="flex flex-col">
          <p className="font-display text-display-lg text-muted">11</p>
          <p className="text-body text-muted flex gap-1">best</p>
        </h1>
      </header>

      <CalendarSection stats={stats} />
    </Fragment>
  );
}
