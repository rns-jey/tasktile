import {
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  Settings,
  SquareIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/Button";

export default function MobileNav() {
  return (
    <nav className="bg-paper-2 fixed inset-x-0 bottom-0 z-50 border-t pt-2 pb-10">
      <ul className="grid grid-cols-5 px-4">
        <li className="flex flex-col items-center gap-1">
          <SquareIcon size={"24"} />
          <Link href="/today">Today</Link>
        </li>
        <li className="flex flex-col items-center gap-1">
          <ListIcon size={"24"} />
          <Link href="/tasks">Tasks</Link>
        </li>
        <li className="-mt-6">
          <Button className="h-16 w-16 rounded-2xl">
            <PlusIcon />
          </Button>
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
