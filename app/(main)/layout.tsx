import React from "react";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Providers from "@/components/providers/Providers";
import currentProfile from "@/lib/current-profile";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await currentProfile();

  if (!profile) {
    if (!profile) redirect("/sign-in");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Providers profile={profile}>{children}</Providers>
    </ThemeProvider>
  );
}
