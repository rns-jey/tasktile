"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";

export default function ThemeSettings() {
  const themes = ["system", "light", "dark"] as const;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const active = mounted ? theme : undefined;

  useEffect(() => setMounted(true), []);

  return (
    <div>
      <p className="text-label mx-2 mt-6 mb-2 font-medium tracking-[.08em] uppercase">
        Appearance
      </p>

      <div className="flex w-full gap-2 rounded-lg p-0.5">
        {themes.map((t) => (
          <Button
            key={t}
            variant={"ghost"}
            type="button"
            className={cn("flex-1 capitalize", active === t && "bg-white")}
            aria-pressed={active === t}
            onClick={() => setTheme(t)}
          >
            {t}
          </Button>
        ))}
      </div>
    </div>
  );
}
