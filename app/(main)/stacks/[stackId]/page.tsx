import { Button } from "@/components/atoms/Button";
import StackTaskSection from "@/components/organisms/sections/StackTaskSection";
import StackPageHeader from "@/components/organisms/Stack/StackPageHeader";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { getStack } from "@/lib/models/stacks/queries";
import currentProfile from "@/lib/profile";
import { getStackTasks } from "@/lib/queries/task";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ChevronLeft, Ellipsis, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type StackPageProps = { params: Promise<{ stackId: string }> };

export default async function StackPage({ params }: StackPageProps) {
  const profile = await currentProfile();
  if (!profile) redirect("/sign-in");

  const { stackId } = await params;
  const stack = await getStack(profile.userID, stackId);
  if (!stack) notFound();

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["tasks", stackId],
    queryFn: () => getStackTasks(profile.userID, stackId),
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link
            href={"/settings"}
            className="inline-flex items-center gap-1 font-medium"
          >
            <ChevronLeft /> Settings
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="secondary"
                  className="size-11 rounded-lg shadow-md"
                />
              }
            >
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash /> Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <StackPageHeader stack={stack} />

        <StackTaskSection stackId={stackId} />
      </div>
    </HydrationBoundary>
  );
}
