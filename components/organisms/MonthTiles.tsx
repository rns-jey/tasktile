"use client";

import { generateMonthCalendar } from "@/lib/utils";

import CalendarGrid from "../molecules/CalendarGrid";
import { useQuery } from "@tanstack/react-query";
import { RawContribution } from "@/types";
import axios from "axios";
import { Skeleton } from "../atoms/skeleton";

type ContributionResponse = {
  contributions: RawContribution[];
  totalCount: number;
};

export default function MonthTiles() {
  const { data } = useQuery<ContributionResponse>({
    queryKey: ["contributions"],
    queryFn: async () => {
      const response = await axios.get("/api/contributions");

      return response.data;
    },
  });

  if (!data)
    return (
      <div className="bg-background max-w-72 space-y-2 rounded-lg p-6 shadow-lg">
        <Skeleton className="h-6 w-60" />
        <Skeleton className="h-6 w-60" />
        <Skeleton className="h-44 w-60" />
      </div>
    );

  const calendarData = generateMonthCalendar(
    data.contributions,
    new Date("2025-05-01"),
  );

  return (
    <div className="bg-background max-w-72 rounded-lg p-6 shadow-lg">
      <h1>May 2025</h1>
      <p>Total: {data.totalCount} Completed</p>
      <CalendarGrid days={calendarData} />
    </div>
  );
}
