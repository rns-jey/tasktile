import PageTitle from "@/components/atoms/PageTitle";
import InboxTaskSection from "@/components/organisms/sections/InboxTaskSection";
import currentProfile from "@/lib/profile";
import { getInbox } from "@/lib/queries/task";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function InboxPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["tasks", "inbox"],
    queryFn: () => getInbox(currentUser.userID),
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="flex items-center justify-between gap-4 pb-4">
        <PageTitle title="Inbox" />
      </header>

      <InboxTaskSection />
    </HydrationBoundary>
  );
}
