import PageTitle from "@/components/atoms/PageTitle";
import TaskList from "@/components/organisms/TaskList";
import { getStack } from "@/lib/models/stacks/queries";
import currentProfile from "@/lib/profile";
import { getStackTasks } from "@/lib/queries/task";
import { notFound, redirect } from "next/navigation";

type StackPageProps = { params: Promise<{ stackId: string }> };

export default async function StackPage({ params }: StackPageProps) {
  const profile = await currentProfile();
  if (!profile) redirect("/sign-in");

  const { stackId } = await params;
  const stack = await getStack(profile.userID, stackId);
  if (!stack) notFound();
  const tasks = await getStackTasks(profile.userID, stackId);

  return (
    <div>
      <PageTitle title={stack.name} />;
      <TaskList tasks={tasks} />
    </div>
  );
}
