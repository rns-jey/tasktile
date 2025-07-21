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

type ContributionResponse = {
  contributions: RawContribution[];
  totalCount: number;
  completedToday: number;
  streak: number;
};

export default function DashboardSection() {
  const [currPage, setCurrPage] = useState("Tasks");

  return (
    <div className="bg-background mx-auto max-w-md rounded-lg p-6 shadow-lg">
      <h1>Dashboard</h1>
      <p>Manage your tasks and track progress</p>

      <div>
        <Button
          variant={"ghost"}
          className={cn(
            currPage == "Tasks" ? "bg-green-300 hover:bg-green-300" : "",
            "w-full items-start justify-start",
          )}
          asChild
        >
          <Link href="/tasks">Tasks</Link>
        </Button>

        <Button
          variant={"ghost"}
          className={cn(
            currPage == "Analytics" ? "bg-green-300" : "",
            "w-full items-start justify-start",
          )}
          asChild
        >
          <Link href="/analytics">Analytics</Link>
        </Button>
      </div>
    </div>
  );
}
