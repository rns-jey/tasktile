import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: "TaskTile - Your To-Do List App",
  description:
    "Manage your tasks efficiently with TaskTile, a simple and intuitive to-do list app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("overscroll-none", `${fontVariables} antialiased`)}
    >
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
