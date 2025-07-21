"use client";

import React, { useState } from "react";
import DashboardSection from "./DashboardSection";
import TaskSection from "./TaskSection";
import { usePathname } from "next/navigation";
import AnalyticsSection from "./AnalyticsSection";

export default function Main() {
  const pathname = usePathname();

  return (
    <main className="flex w-full max-w-7xl flex-row items-start gap-4 p-4">
      <DashboardSection pathname={pathname} />
      {pathname === "/" || pathname === "/tasks" ? (
        <TaskSection />
      ) : (
        <AnalyticsSection />
      )}
    </main>
  );
}
