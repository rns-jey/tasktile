import { LayoutGridIcon, ListIcon, Settings, SquareIcon } from "lucide-react";
import Link from "next/link";
import NewTaskForm from "./NewTaskForm";

export default function MobileNav() {
  return (
    <nav className="bg-paper-2 shrink-0 border-t pt-2 pb-10 md:hidden">
      <ul className="grid grid-cols-5 px-4">
        <li className="flex flex-col items-center gap-1">
          <SquareIcon size={"24"} />
          <Link href="/today">Today</Link>
        </li>
        <li className="flex flex-col items-center gap-1">
          <ListIcon size={"24"} />
          <Link href="/tasks">Tasks</Link>
        </li>
        <li className="-mt-8 flex items-center justify-center">
          <NewTaskForm />
        </li>
        <li className="flex flex-col items-center gap-1">
          <LayoutGridIcon />
          <Link href="/analytics">Analytics</Link>
        </li>
        <li className="flex flex-col items-center gap-1">
          <Settings />
          <Link href="/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
}
