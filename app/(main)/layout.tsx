import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { dayInTz } from "@/lib/date";
import currentProfile from "@/lib/profile";

import AppSidebar from "@/components/organisms/AppSidebar";
import MobileNav from "@/components/organisms/MobileNav";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TimezoneSync from "@/components/providers/TimezoneSync";
import { TodayProvider } from "@/components/providers/TodayProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import ContentShell from "@/components/templates/ContentShell";
import { SidebarInset, SidebarProvider } from "@/components/ui/Sidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await currentProfile();

  if (!currentUser) redirect("/sign-in");

  const tz = (await cookies()).get("tz")?.value ?? "UTC";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TodayProvider todayKey={dayInTz(tz)}>
        <UserProvider user={currentUser}>
          <ReactQueryProvider>
            <TimezoneSync />
            <SidebarProvider>
              <AppSidebar />

              <SidebarInset className="flex h-dvh w-full flex-col overflow-hidden">
                <ContentShell>
                  {children}

                  <MobileNav />
                </ContentShell>
              </SidebarInset>
            </SidebarProvider>
          </ReactQueryProvider>
        </UserProvider>
      </TodayProvider>
    </ThemeProvider>
  );
}
