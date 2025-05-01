import { Calendar } from "lucide-react";

export default function CompletedToday() {
  return (
    <div className="max-w-72 p-6 bg-background rounded-lg shadow-lg">
      <div className="flex gap-1">
        <Calendar />
        <h1>Today</h1>
      </div>

      <h1>3</h1>
      <p>tasks completed today</p>
    </div>
  );
}
