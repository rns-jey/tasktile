import { Calendar } from "lucide-react";

type CompletedTodayProps = {
  completedToday: number;
};

export default function CompletedToday({
  completedToday,
}: CompletedTodayProps) {
  return (
    <div className="bg-background max-w-72 rounded-lg p-6 shadow-lg">
      <div className="flex gap-1">
        <Calendar />
        <h1>Today</h1>
      </div>

      <h1>{completedToday}</h1>
      <p>tasks completed today</p>
    </div>
  );
}
