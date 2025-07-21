"use client";

import React, { useState } from "react";
import DashboardSection from "./DashboardSection";
import TaskSection from "./task-section";
import { usePathname } from "next/navigation";
import AnalyticsSection from "./AnalyticsSection";

export default function Main() {
  const pathname = usePathname();

  return (
    <main className="flex flex-row gap-4 p-4">
      <DashboardSection pathname={pathname} />
      {pathname === "/" || pathname === "/tasks" ? (
        <TaskSection />
      ) : (
        <AnalyticsSection />
      )}
    </main>
  );
}
