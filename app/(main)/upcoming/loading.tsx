import { Skeleton } from "@/components/ui/Skeleton";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

export default function UpcomingLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="grid grid-cols-7 place-content-center text-center">
          {weekDays.map((wd, wdi) => (
            <div key={wdi} className="w-11">
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 place-content-center text-center">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <Skeleton key={`weekday_${day}`} className="size-11" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-7 w-full" />
      </div>
    </div>
  );
}
