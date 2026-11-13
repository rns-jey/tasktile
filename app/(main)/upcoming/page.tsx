import UpcomingSection from "@/components/organisms/UpcomingSection";
import currentProfile from "@/lib/profile";
import { getOnDue } from "@/lib/queries/task";
import { getToday } from "@/lib/today";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function UpcomingPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const today = await getToday();

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["tasks", "upcoming"],
    queryFn: () => getOnDue(currentUser.userID, today),
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UpcomingSection />
    </HydrationBoundary>
  );
}
