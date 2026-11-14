"use client";

import { authClient } from "@/lib/auth/client";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "../atoms/Button";

export default function SignOutSection() {
  const handleSignOut = async () => {
    await authClient.signOut();
    redirect("/sign-in");
  };

  return (
    <div>
      <p className="text-label mx-2 mt-6 mb-2 font-medium tracking-[.08em] uppercase">
        App
      </p>

      <div className="flex min-h-11 w-full flex-col gap-2 rounded-lg bg-white px-4 py-2">
        <Button
          variant={"ghost"}
          type="button"
          className="flex w-full items-center justify-start gap-4 p-0"
          onClick={handleSignOut}
        >
          <LogOut className="size-6" /> Sign out
        </Button>
      </div>
    </div>
  );
}
