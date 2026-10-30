"use client";

import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { ChevronRight, LayoutGridIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function SettingsPage() {
  const themes = ["system", "light", "dark"] as const;
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const active = mounted ? theme : undefined;

  const handleSignOut = async () => {
    await authClient.signOut();
    redirect("/sign-in");
  };

  return (
    <Fragment>
      <header className="flex flex-col justify-between gap-4 pb-4">
        <h1 className="flex flex-col">
          <span className="font-display text-display-lg">Settings</span>
        </h1>
      </header>

      <div>
        <p className="text-label text-muted-2 mx-2 mt-6 mb-2 font-medium tracking-[.08em] uppercase">
          Tasks
        </p>

        <Button
          className="flex h-11 w-full items-center justify-between bg-white text-base"
          variant={"outline"}
          nativeButton={false}
          render={<Link href="/settings/categories" />}
        >
          <div className="flex items-center gap-1">
            <LayoutGridIcon className="size-6" />
            <span className="leading-none [text-box:trim-both_cap_alphabetic]">
              Categories
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="leading-none [text-box:trim-both_cap_alphabetic]">
              104
            </span>
            <ChevronRight />
          </div>
        </Button>
      </div>

      <div>
        <p className="text-label text-muted-2 mx-2 mt-6 mb-2 font-medium tracking-[.08em] uppercase">
          Appearance
        </p>

        <div className="bg-paper-2 flex w-full rounded-lg p-0.5">
          {themes.map((t) => (
            <Button
              key={t}
              variant={"ghost"}
              type="button"
              className={cn(
                "h-10 flex-1 capitalize",
                active === t && "bg-white",
              )}
              aria-pressed={active === t}
              onClick={() => setTheme(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-label text-muted-2 mx-2 mt-6 mb-2 font-medium tracking-[.08em] uppercase">
          App
        </p>

        <Button
          variant={"ghost"}
          type="button"
          className="flex h-11 w-full justify-start bg-white text-base"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </div>
    </Fragment>
  );
}
