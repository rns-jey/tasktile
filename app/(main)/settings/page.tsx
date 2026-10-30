import ThemeSettings from "@/components/organisms/ThemeSettings";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth/client";
import { ChevronRight, LayoutGridIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default function SettingsPage() {
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

      <ThemeSettings />

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
