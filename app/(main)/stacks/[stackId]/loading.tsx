import { Button } from "@/components/atoms/Button";
import PageTitle from "@/components/atoms/PageTitle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronLeft, Ellipsis, Pencil, Trash } from "lucide-react";
import Link from "next/link";

export default function StackLoading() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link
            href={"/settings"}
            className="inline-flex items-center gap-1 font-medium"
          >
            <ChevronLeft /> Settings
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="secondary"
                  className="size-11 rounded-lg shadow-md"
                />
              }
            >
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash /> Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <header>
          <PageTitle title="TaskTile" />
          <Skeleton className="h-6 w-28" />
        </header>

        <div className="flex flex-col">
          {[1, 2, 3, 4, 5].map((t) => (
            <div
              key={t}
              className="border-line flex h-16 items-center gap-3.5 border-b px-2 hover:bg-white"
            >
              <Skeleton className="size-4" />

              <Skeleton className="size-6" />

              <Skeleton className="h-6 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
