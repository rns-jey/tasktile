import type { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { fontVariables } from "./fonts";

// [device-width, device-height, pixel-ratio]
const SPLASH_SCREENS = [
  [1032, 1376, 2],
  [1024, 1366, 2],
  [834, 1210, 2],
  [834, 1194, 2],
  [834, 1112, 2],
  [768, 1024, 2],
  [820, 1180, 2],
  [810, 1080, 2],
  [744, 1133, 2],
  [440, 956, 3],
  [402, 874, 3],
  [420, 912, 3],
  [430, 932, 3],
  [393, 852, 3],
  [390, 844, 3],
  [428, 926, 3],
  [360, 780, 3],
  [414, 896, 3],
  [375, 812, 3],
  [414, 896, 2],
  [414, 736, 3],
  [375, 667, 2],
  [320, 568, 2],
] as const;

export const metadata: Metadata = {
  title: "TaskTile - Your To-Do List App",
  description:
    "Manage your tasks efficiently with TaskTile, a simple and intuitive to-do list app.",
  appleWebApp: {
    capable: true,

    title: "TaskTile",
    statusBarStyle: "default",
    startupImage: SPLASH_SCREENS.map(([w, h, r]) => ({
      url: `/splash/apple-splash-${w * r}-${h * r}.jpg`,
      media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)`,
    })),
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
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
