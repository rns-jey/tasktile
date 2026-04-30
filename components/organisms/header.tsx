"use client";

import { Diamond, Moon, Sun } from "lucide-react";
import React from "react";
import { Button } from "../atoms/button";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { useTheme } from "next-themes";

export default function Header() {
  const { setTheme } = useTheme();

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between space-x-4 px-4">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Diamond className="h-6 w-6" />
            <span>TaskTile</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <SignedOut>
            <Button variant="outline" size="sm" className="ml-4">
              <Link href={"/sign-in"}>Log in</Link>
            </Button>
            <Button size="sm">
              <Link href={"/sign-up"}>Sign up</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
