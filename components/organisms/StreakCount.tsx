import { Flame } from "lucide-react";

type StreakCountProps = {
  streak: number;
};

export default function StreakCount({ streak }: StreakCountProps) {
  return (
    <div className="bg-background max-w-72 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-1">
        <Flame className="w-4" />
        <h1 className="text-sm font-bold">Streak</h1>
      </div>

      <h1 className="text-3xl font-bold">{streak}</h1>
      <p className="text-sm">days in a row</p>
    </div>
  );
}
