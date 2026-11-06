"use client";

import { LayoutGridIcon, ListIcon, SettingsIcon, Sun } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import NewTaskDrawer from "./NewTaskDrawer";

const navItems = [
  { href: "/", label: "Today", icon: Sun },
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
          "my-1 flex flex-col items-center gap-1 rounded-2xl p-1",
          active ? "text-task" : "",
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
    <div className="z-50 px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <nav className="shrink-0 rounded-2xl border-t p-1 md:hidden">
        <ul className="grid grid-cols-5 gap-2">
          {navItems.slice(0, 2).map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
          <li className="-mt-6 flex items-center justify-center">
            <NewTaskDrawer />
          </li>
          {navItems.slice(2).map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
