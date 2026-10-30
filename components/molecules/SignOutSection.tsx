"use client";

import { authClient } from "@/lib/auth/client";
import { redirect } from "next/navigation";
import { Button } from "../ui/Button";

export default function SignOutSection() {
  const handleSignOut = async () => {
    await authClient.signOut();
    redirect("/sign-in");
  };

  return (
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
  );
}
