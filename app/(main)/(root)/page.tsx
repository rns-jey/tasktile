import { redirect } from "next/navigation";

import currentProfile from "@/lib/profile";
import { getTodayTasks } from "@/lib/queries/task";
import { getToday } from "@/lib/today";

import TodayHeader from "@/components/organisms/TodayHeader";
import TodayTaskSection from "@/components/organisms/TodayTaskSection";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Home() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const today = await getToday();

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["tasks", "today"],
    queryFn: () => getTodayTasks(currentUser.userID, today),
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodayHeader />

      {/* <UnfinishedBanner /> */}

      <TodayTaskSection />
    </HydrationBoundary>
  );
}
