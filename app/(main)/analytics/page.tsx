import AnalyticsHeader from "@/components/organisms/AnalyticsHeader";
import CalendarSection from "@/components/organisms/CalendarSection";
import currentProfile from "@/lib/profile";
import { getStats } from "@/lib/queries/stats";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Analytics() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["stats"],
    queryFn: () => getStats(currentUser.userID),
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnalyticsHeader />

      <CalendarSection />
    </HydrationBoundary>
  );
}
