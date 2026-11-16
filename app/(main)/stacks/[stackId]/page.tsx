import { Button } from "@/components/atoms/Button";
import PageTitle from "@/components/atoms/PageTitle";
import StackTaskSection from "@/components/organisms/sections/StackTaskSection";

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
  const tasks = await getStackTasks(profile.userID, stackId);
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="flex flex-col gap-4">
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
      <header>
        <PageTitle title={stack.name} />
        <p className="flex gap-1">
          {completedTasks ? completedTasks.length : 0}
          <span>done</span>
          <span>·</span>
          {activeTasks ? activeTasks.length : 0} open
        </p>
      </header>

      <StackTaskSection stackId={stackId} />
    </div>
  );
}
