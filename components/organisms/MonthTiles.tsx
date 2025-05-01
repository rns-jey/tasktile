import { generateMonthCalendar } from "@/lib/utils";

import CalendarGrid from "../molecules/CalendarGrid";

const rawData = [
  { date: "2025-04-30T23:00:00.000Z", count: 4 },
  { date: "2025-05-01T23:00:00.000Z", count: 2 },
  { date: "2025-05-03T23:00:00.000Z", count: 0 },
  { date: "2025-05-05T23:00:00.000Z", count: 4 },
  { date: "2025-05-09T23:00:00.000Z", count: 1 },
  { date: "2025-05-12T23:00:00.000Z", count: 1 },
];

export default function MonthTiles() {
  const calendarData = generateMonthCalendar(rawData, new Date("2025-05-01"));

  return (
    <div className="max-w-72 p-6 bg-background rounded-lg shadow-lg">
      <h1>May 2025</h1>
      <p>Total: 150 Completed</p>
      <CalendarGrid days={calendarData} />
    </div>
  );
}
