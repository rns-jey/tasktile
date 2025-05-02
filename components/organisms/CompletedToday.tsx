import { Calendar } from "lucide-react";

type CompletedTodayProps = {
  completedToday: number;
};

export default function CompletedToday({
  completedToday,
}: CompletedTodayProps) {
  return (
    <div className="bg-background max-w-72 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-1">
        <Calendar className="w-4" />
        <h1 className="text-sm font-bold">Today</h1>
      </div>

      <h1 className="text-3xl font-bold">{completedToday}</h1>
      <p className="text-sm">tasks completed today</p>
    </div>
  );
}
