import { number } from "zod";
import CalendarGrid from "../molecules/CalendarGrid";
import { CalendarDay } from "@/types";

type MonthTilesProps = {
  totalCount: number;
  calendarData: CalendarDay[];
};

export default function MonthTiles({
  totalCount,
  calendarData,
}: MonthTilesProps) {
  return (
    <div className="bg-background max-w-72 rounded-lg p-6 shadow-lg">
      <h1 className="text-2xl font-bold">May 2025</h1>
      <p className="text-xs">Total: {totalCount} Completed</p>
      <CalendarGrid days={calendarData} />
    </div>
  );
}
