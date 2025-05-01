import { CalendarDay } from "@/types";
import { format } from "date-fns";

interface CalendarGridProps {
  days: CalendarDay[];
}

export default function CalendarGrid({ days }: CalendarGridProps) {
  const colorScale = ["#e5e7eb", "#7bf1a8", "#05df72", "#00c950", "#00A63E"];

  const getColor = (count: number) => {
    if (count === 0) return colorScale[0];
    if (count <= 2) return colorScale[1];
    if (count <= 4) return colorScale[2];
    if (count <= 6) return colorScale[3];
    return colorScale[4];
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayObj: CalendarDay) => (
          <div
            key={dayObj.date.toISOString()}
            title={`${format(dayObj.date, "MMM d")}: ${dayObj.count} contributions`}
            className={`w-8 h-8 flex items-center justify-center text-xs rounded green-600 ${
              dayObj.isCurrentMonth ? "" : "opacity-0"
            }`}
            style={{ backgroundColor: getColor(dayObj.count) }}
          />
        ))}
      </div>
    </div>
  );
}
