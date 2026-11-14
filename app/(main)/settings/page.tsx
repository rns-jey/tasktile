import { Button } from "@/components/atoms/Button";
import SignOutSection from "@/components/molecules/SignOutSection";
import StackSection from "@/components/organisms/StackSection";
import ThemeSettings from "@/components/organisms/ThemeSettings";
import { getStacksWithTaskCount } from "@/lib/models/stacks/queries";
import currentProfile from "@/lib/profile";
import { getCategoriesCount } from "@/lib/queries/categories";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { ChevronRight, LayoutGridIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const categoryCount = await getCategoriesCount(currentUser.userID);

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ["stacks", "list"],
    queryFn: () => getStacksWithTaskCount(currentUser.userID),
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <header className="flex flex-col justify-between gap-4 pb-4">
        <h1 className="flex flex-col">
          <span className="font-heading text-4xl">Settings</span>
        </h1>
      </header>

      <div>
        <p className="text-label mx-2 mt-6 mb-2 font-medium tracking-[.08em] uppercase">
          Tasks
        </p>

        <Button
          className="flex w-full items-center justify-between bg-white"
          variant={"outline"}
          nativeButton={false}
          render={<Link href="/settings/categories" />}
        >
          <div className="flex items-center gap-1">
            <LayoutGridIcon className="size-6" />
            <span className="leading-none [text-box:trim-both_cap_alphabetic]">
              Categories
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="leading-none [text-box:trim-both_cap_alphabetic]">
              {categoryCount}
            </span>
            <ChevronRight />
          </div>
        </Button>
      </div>

      <ThemeSettings />

      <StackSection />

      <SignOutSection />
    </HydrationBoundary>
  );
}
