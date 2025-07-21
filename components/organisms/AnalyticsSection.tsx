"use client";

import MonthTiles from "./MonthTiles";
import CompletedToday from "./CompletedToday";
import { generateMonthCalendar } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RawContribution } from "@/types";
import { Skeleton } from "../atoms/skeleton";
import StreakCount from "./StreakCount";

type ContributionResponse = {
  contributions: RawContribution[];
  totalCount: number;
  completedToday: number;
  streak: number;
};

export default function AnalyticsSection() {
  const { data } = useQuery<ContributionResponse>({
    queryKey: ["contributions"],
    queryFn: async () => {
      const response = await axios.get("/api/contributions");

      return response.data;
    },
  });

  if (!data)
    return (
      <div className="flex gap-2">
        <div>
          <div className="bg-background max-w-72 space-y-2 rounded-lg p-6 shadow-lg">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-44 w-60" />
          </div>
        </div>

        <div>
          <div className="bg-background max-w-72 space-y-2 rounded-lg p-6 shadow-lg">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>

        <div>
          <div className="bg-background max-w-72 space-y-2 rounded-lg p-6 shadow-lg">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
    );

  const calendarData = generateMonthCalendar(data.contributions, new Date());

  const now = new Date();
  const todayDateString = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );

  // Format todayDateString to compare only the date part (ignoring time)
  const todayDateOnly = todayDateString.toISOString().split("T")[0]; // 'YYYY-MM-DD'

  // Check if any completed date matches the current date (ignoring time)
  const completedToday = calendarData.find((completed) => {
    const completedDateOnly = new Date(completed.completedAt)
      .toISOString()
      .split("T")[0];

    return completedDateOnly === todayDateOnly;
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <MonthTiles totalCount={data.totalCount} calendarData={calendarData} />

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <CompletedToday completedToday={data.completedToday} />
            <StreakCount streak={data.streak} />
          </div>

          <div className="bg-background h-full w-full rounded-lg p-6 shadow-lg" />
        </div>
      </div>

      <div className="bg-background h-56 w-full rounded-lg p-6 shadow-lg" />
    </div>
  );
}
