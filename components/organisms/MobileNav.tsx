"use client";

import {
  LayoutGridIcon,
  ListIcon,
  SettingsIcon,
  SquareIcon,
} from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import NewTaskDrawer from "./NewTaskDrawer";

const navItems = [
  { href: "/", label: "Today", icon: SquareIcon },
  { href: "/tasks", label: "Tasks", icon: ListIcon },
  { href: "/analytics", label: "Analytics", icon: LayoutGridIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

type NavItem = (typeof navItems)[number];

function NavLink({ href, label, icon: Icon }: NavItem) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <li>
      <NextLink
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex flex-col items-center gap-1",
          active ? "text-task" : "text-muted",
        )}
      >
        <Icon size={24} />
        <span className="text-xs">{label}</span>
      </NextLink>
    </li>
  );
}

export default function MobileNav() {
  return (
    <nav className="bg-paper-2 shrink-0 border-t pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <ul className="grid grid-cols-5 px-4">
        {navItems.slice(0, 2).map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        <li className="-mt-8 flex items-center justify-center">
          <NewTaskDrawer />
        </li>
        {navItems.slice(2).map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  );
}
