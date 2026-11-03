import AnalyticsHeader from "@/components/organisms/AnalyticsHeader";
import CalendarSection from "@/components/organisms/CalendarSection";
import currentProfile from "@/lib/profile";
import { getTaskCount } from "@/lib/queries/task";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function Analytics() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const stats = await getTaskCount(currentUser.userID);

  return (
    <Fragment>
      <AnalyticsHeader stats={stats} />

      <CalendarSection stats={stats} />
    </Fragment>
  );
}
