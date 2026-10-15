"use client";

import { authClient } from "@/lib/auth/client";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";

export default function AppHeader() {
  const today = new Date();
  const { setTheme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut();
    redirect("/sign-in");
  };

  return (
    // <header className="bg-paper/95 sticky top-0 z-50 w-full border-b">
    //   <div className="container mx-auto flex h-16 items-center justify-between space-x-4 px-4">
    //     <div className="flex w-full justify-between">
    //       <div className="flex items-center gap-2 text-xl font-bold">
    //         <Diamond className="h-6 w-6" />
    //         <span>TaskTile</span>
    //       </div>

    //       <div className="flex gap-2">
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button variant={"outline"} size="icon">
    //               <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
    //               <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    //               <span className="sr-only">Toggle theme</span>
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align="end">
    //             <DropdownMenuItem onClick={() => setTheme("light")}>
    //               Light
    //             </DropdownMenuItem>
    //             <DropdownMenuItem onClick={() => setTheme("dark")}>
    //               Dark
    //             </DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>

    //         <Button
    //           variant="outline"
    //           size="icon"
    //           className="p-1.5"
    //           onClick={handleSignOut}
    //         >
    //           <LogOut className="h-[1.2rem] w-[1.2rem]" />
    //         </Button>
    //       </div>
    //     </div>

    //     {/* <div className="flex gap-2">
    //       <Button variant="outline" size="sm" className="ml-4">
    //         <Link href={"/sign-in"}>Log in</Link>
    //       </Button>
    //       <Button size="sm">
    //         <Link href={"/sign-up"}>Sign up</Link>
    //       </Button>
    //     </div> */}
    //   </div>
    // </header>

    <header className="flex justify-between">
      <div>
        <h1 className="flex flex-col">
          <span className="text-meta text-muted-2 font-medium tracking-[.08em] uppercase">
            {format(today, "eeee").toUpperCase()}
          </span>
          <span className="font-display text-display-lg">
            {format(today, "LLLL d")}
          </span>
        </h1>
        <p className="text-body text-muted">2 done today · 4 open</p>
      </div>

      <div>
        <span>2</span>
      </div>
    </header>
  );
}
