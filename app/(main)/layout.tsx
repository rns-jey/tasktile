import React from "react";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
}
