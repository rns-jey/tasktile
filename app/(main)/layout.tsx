import React from "react";

import AppSidebar from "@/components/organisms/AppSidebar";
import MobileNav from "@/components/organisms/MobileNav";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TimezoneSync from "@/components/providers/TimezoneSync";
import { TodayProvider } from "@/components/providers/TodayProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/Sidebar";
import { dayInTz } from "@/lib/date";
import { cookies } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tz = (await cookies()).get("tz")?.value ?? "UTC";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TodayProvider todayKey={dayInTz(tz)}>
        <ReactQueryProvider>
          <TimezoneSync />
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset className="flex h-dvh w-full flex-col overflow-hidden">
              {children}

              <MobileNav />
            </SidebarInset>
          </SidebarProvider>
        </ReactQueryProvider>
      </TodayProvider>
    </ThemeProvider>
  );
}
