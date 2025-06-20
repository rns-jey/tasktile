import { Diamond } from "lucide-react";
import React from "react";
import { Button } from "../atoms/button";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95">
      <div className="container mx-auto flex h-16 items-center justify-between space-x-4 px-4">
        <div className="flex gap-2 items-center text-xl font-bold">
          <Diamond className="h-6 w-6" />
          <span>TaskTile</span>
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
