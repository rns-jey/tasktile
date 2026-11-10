"use client";

import { motion } from "motion/react";

import { LayoutGridIcon, ListIcon, SettingsIcon, Sun } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

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
    <li className="relative isolate">
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="bg-jade/15 absolute inset-0 -z-10 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-black/5 backdrop-blur-md"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 32,
            mass: 0.8,
          }}
        />
      )}
      <NextLink
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex flex-col items-center gap-1 rounded-full px-1 py-1.5 transition-colors",
          active ? "text-jade" : "text-ink/60",
        )}
      >
        <Icon size={22} />
        <span className="text-[11px]">{label}</span>
      </NextLink>
    </li>
  );
}

export default function MobileNav() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-50">
      <nav className="bg-background/60 mx-4 mb-[max(0.5rem,env(safe-area-inset-bottom))] rounded-full border border-white/40 p-1 shadow-lg backdrop-blur-xl backdrop-saturate-150 md:hidden">
        <ul className="grid grid-cols-4">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </ul>
      </nav>
    </div>
  );
}
