"use client";

import { generateMonthCalendar } from "@/lib/utils";

import CalendarGrid from "../molecules/CalendarGrid";
import { useQuery } from "@tanstack/react-query";
import { RawContribution } from "@/types";
import axios from "axios";

export default function MonthTiles() {
  const { data: contributions } = useQuery<RawContribution[]>({
    queryKey: ["contributions"],
    queryFn: async () => {
      const response = await axios.get("/api/contributions");

      return response.data;
    },
  });

  if (!contributions) return <div>Loading...</div>;

  const calendarData = generateMonthCalendar(contributions, new Date("2025-05-01"));

  return (
    <div className="max-w-72 p-6 bg-background rounded-lg shadow-lg">
      <h1>May 2025</h1>
      <p>Total: 150 Completed</p>
      <CalendarGrid days={calendarData} />
    </div>
  );
}
