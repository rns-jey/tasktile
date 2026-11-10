import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { dayInTz } from "@/lib/date";
import currentProfile from "@/lib/profile";

import AppSidebar from "@/components/organisms/AppSidebar";
import MobileNav from "@/components/organisms/MobileNav";
import NewTaskDrawer from "@/components/organisms/NewTaskDrawer";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TimezoneSync from "@/components/providers/TimezoneSync";
import { TodayProvider } from "@/components/providers/TodayProvider";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { SidebarInset, SidebarProvider } from "@/components/ui/Sidebar";
import { getCategories, getRecentCategories } from "@/lib/queries/categories";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tz = (await cookies()).get("tz")?.value ?? "UTC";

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.query({
      queryKey: ["categories"],
      queryFn: () => getCategories(currentUser.userID),
    }),
    queryClient.query({
      queryKey: ["categories", "recent"],
      queryFn: () => getRecentCategories(currentUser.userID),
    }),
  ]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TodayProvider todayKey={dayInTz(tz)}>
        <ReactQueryProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <TimezoneSync />
            <SidebarProvider>
              <AppSidebar />

              <SidebarInset className="relative h-dvh overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 pb-32">{children}</div>
                </ScrollArea>

                <NewTaskDrawer />

                <MobileNav />
              </SidebarInset>
            </SidebarProvider>
          </HydrationBoundary>
        </ReactQueryProvider>
      </TodayProvider>
    </ThemeProvider>
  );
}
