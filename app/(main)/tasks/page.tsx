import { redirect } from "next/navigation";

import currentProfile from "@/lib/profile";
import { getTasks } from "@/lib/queries/task";

import TaskListSection from "@/components/organisms/TaskListSection";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function TasksPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["tasks", "all"],
    queryFn: () => getTasks(currentUser.userID),
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskListSection />
    </HydrationBoundary>
  );
}
