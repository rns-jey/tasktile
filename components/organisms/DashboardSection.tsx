"use client";

import MonthTiles from "./MonthTiles";
import CompletedToday from "./CompletedToday";
import { cn, generateMonthCalendar } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RawContribution } from "@/types";
import { Skeleton } from "../atoms/skeleton";
import StreakCount from "./StreakCount";
import { useState } from "react";
import { Button } from "../atoms/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type ContributionResponse = {
  contributions: RawContribution[];
  totalCount: number;
  completedToday: number;
  streak: number;
};

const tabs = [
  { name: "Tasks", href: "/tasks", match: ["/", "/tasks"] },
  { name: "Analytics", href: "/analytics", match: ["/analytics"] },
];

interface DashboardSectionProps {
  pathname: string;
}

export default function DashboardSection({ pathname }: DashboardSectionProps) {
  const router = useRouter();

  return (
    <div className="bg-background mx-auto max-w-md rounded-lg p-6 shadow-lg">
      <h1>Dashboard</h1>
      <p>Manage your tasks and track progress</p>

      <div className="flex flex-col gap-1">
        {tabs.map((tab, i) => {
          const isActive = tab.match.includes(pathname);

          return (
            <Button
              key={i}
              variant={"ghost"}
              className={cn(
                isActive ? "bg-green-300 hover:bg-green-300" : "",
                "w-full items-start justify-start",
              )}
              asChild
            >
              <Link href={tab.href}>{tab.name}</Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
