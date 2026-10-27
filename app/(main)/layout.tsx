import React from "react";

import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TimezoneSync from "@/components/providers/TimezoneSync";
import { SidebarProvider } from "@/components/ui/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        <TimezoneSync />
        <SidebarProvider>{children}</SidebarProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
