import { CalendarDay } from "@/types";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../atoms/tooltip";

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
          <TooltipProvider key={dayObj.completedAt.toISOString()}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`green-600 flex h-8 w-8 items-center justify-center rounded text-xs ${
                    dayObj.isCurrentMonth ? "" : "opacity-0"
                  }`}
                  style={{ backgroundColor: getColor(dayObj._count.completed) }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${dayObj._count.completed > 0 ? dayObj._count.completed : "No"} completed on ${format(dayObj.completedAt, "MMM d")}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
